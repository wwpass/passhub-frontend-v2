import { useState, useEffect, useRef } from 'react'
import axios from "axios";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ToastContainer from 'react-bootstrap/ToastContainer'

import { useIdleTimer } from "react-idle-timer";

import Header from "./header";
import MainPage from "./mainPage";
import ViewFile from "./viewFile";
import SurveyToast from "./surveyToast";
import CopyMoveToast from './copyMoveToast';

import SurveyModal from "./surveyModal";
import IdleModal from "./idleModal"
import MessageModal from './messageModal';
import UserManagementPage from './userManagementPage';

import progress from "../lib/progress";

import { downloadUserData } from "../lib/userData";

import { advise } from "../lib/search";
import * as extensionInterface from "../lib/extensionInterface";
import { keepTicketAlive, enablePaste, serverLog, getApiUrl, getVerifier, getFolderById } from "../lib/utils";

let firstTime = true;
let idleM = null;
let copyMoveOperation = "";



function userDataQuery() {

  //console.log("userData query called");

  progress.lock();
  return downloadUserData()
    .then(data => {
      progress.unlock();
      return (data);
    })
    .catch(err => {
      console.log('caught 31');
    })
}

extensionInterface.connect(advise);

document.addEventListener("passhubExtInstalled", function (data) {
  console.log("got passhubExtInstalled");
  extensionInterface.connect(advise);
});


let wrongOrigin = 0;

function listenToPaymentMessage(cb) {
  window.addEventListener("message", (event) => {
    if (("data" in event) && (
      (event.data.source == "react-devtools-content-script")
      || (event.data.source == "react-devtools-bridge"))
    ) {
      //           console.log(`--got ${event.data.source}--`);
      return;
    }
    console.log('got message');
    console.log(event);

    if (event.origin !== window.location.origin) {
      if (wrongOrigin < 5) {
        // report warning to the server, however harmless in our case
        serverLog(`payment message orign ${event.origin}`)
        wrongOrigin++;
      }
      console.log(`payment message origin ${event.origin}`);
      return;
    }
    if (event.data == "payment_success") {
      cb();
      return;
      //        this.getAccountData();
    }

    if (event.data == "payment_cancel") {
      serverLog("Payment cancel");

      axios
        .post(`${getApiUrl()}payments/session_cancel.php`, { verifier: getVerifier() })
        .then((reply) => {
          const result = reply.data;
          if (result.status === "Ok") {
            return;
          }
          if (result.status === "login") {
            window.location.href = "expired.php";
            return;
          }
          return;
        })
        .catch((err) => {
          //        this.setState({ errorMsg: "Server error. Please try again later" });
        });
    }

  },
    false
  );
}

function Root(props) {

  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState('Main');
  const [udata, setUData] = useState({})
  const [activeFolderId, setActiveFolderId] = useState(null)
  const [filename, setFilename] = useState("");
  const [blob, setBlob] = useState(null);
  const [showToast, setShowToast] = useState("");
  const [showModal, setShowModal] = useState("");

  const queryClient = useQueryClient();

  const dataMutation = useMutation({
    mutationFn: (_args) => Promise.resolve(_args),
    onSuccess: data => {
      queryClient.invalidateQueries(["userData"], { exact: true })
    },
  })

  const gotPaymentMessage = () => {
    dataMutation.mutate();
    console.log('gotPaymentMessage');
    //      setUpdateCounter(updateCounter + 1); 
  }

  const userQuery = useQuery({
    queryKey: ["userData"],
    queryFn: () => userDataQuery().then(data => {
      setUData(data);
      setActiveFolderId(data.currentSafe);
      if (firstTime) {
        firstTime = false;
        listenToPaymentMessage(gotPaymentMessage);
        keepTicketAlive(data.WWPASS_TICKET_TTL, data.ticketAge);

        if ("takeSurvey" in data && data.takeSurvey == true) {
          setShowToast("takeSurveyToast");
        }

        if ("theme" in data) {
          const themes = ["theme-lite", "theme-dark2"];
          document.querySelector("body").classList.remove(...themes);

          document.querySelector("body").classList.add(data.theme);
        }

      }
      // console.log('safes count', data.safes.length);
      return data;
    }),
    onSuccess: (data) => {
      //       console.log('onSuccess', data)
    },
    onError: (err) => {
      console.log('onError', err)
    },
    onSettled: (data) => {
      // console.log('onSettled')
      if (data) {
        // console.log('OS total1', data.totalRecords)
      }
    },

  });


  //  -----------------------

  const cmtResult = useQuery({
    queryKey: ["copyMoveToast1"],
    queryFn: () => Promise.resolve(2).then(data => {
      return data;
    }),
  });

  const cmtData = cmtResult.data;

  useEffect(() => {

    if ((typeof cmtData == "object") && ("item" in cmtData) && ("operation" in cmtData)) {
      if (showToast != "CopyMoveToast") {
        setShowToast("CopyMoveToast");
        enablePaste(true);
        // setCopyMoveToastOperation(cmtData.operation);
        // console.log(107, cmtData);
      }
    }
  }, [cmtData])

  const accountDataMutation = useMutation({
    mutationFn: (_args) => {
      Promise.resolve(3).then(data => {
        // console.log("accountData mutate", data);
        return udata;
      })
    },

    onSuccess: (data, variables, context) => {
      // console.log("setQueryData after accountDataMutation mutate", data, variables);
      queryClient.setQueryData(["accountData"], udata);
    },
  })

  useEffect(() => { accountDataMutation.mutate() }, [udata])


  const copyMoveMutation = useMutation({
    mutationFn: (_args) => {
      const { node, pItem, operation } = _args;
      return dropAndPaste.doMove(props.safes, node, pItem, operation);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["userData"], { exact: true })
    },
    onError: (err, variables, context) => {
      if (err.message == "no dst write") {
        setShowModal("NoRightsModal");
        setMessageModalArgs({
          message:
            'Sorry, "Paste" is forbidden. You have only read access to the destination safe.',
        })
        return;
      }
      if (err.message == "no src write") {
        setShowModal("NoRightsModal");
        setMessageModalArgs({
          message:
            'Sorry, "Move" operation is forbidden. You have only read access to the source safe.',
        })
        return;
      }
    }
  })

  let timeout = (udata && udata.idleTimeout) ? udata.idleTimeout : 123;



  const idleTimer = useIdleTimer({
    //         timeout: 4 * 60 * 60 * 1000 , // 3 min
    timeout: timeout * 1000,

    promptBeforeIdle: 60 * 1000,
    onIdle: () => {
      console.log('onIdle timeout');
      window.location = "logout.php";
    },
    onPrompt: () => {
      console.log('onPropmt timeout');
      if (showModal != "IdleModal") {
        setShowModal("IdleModal");
      }
    },
  });
  /*      
        if(!idleM) {
          idleM = setInterval(() => {console.log('remaining time', idleTimer.getRemainingTime()/1000)}, 500)
        }
  */
  const restartIdleTimer = () => {
    idleTimer.start();
  }

  extensionInterface.setRestartIdleTimer(restartIdleTimer);



  const setActiveFolder = (folder) => {
    setSearchString('');

    if (typeof folder !== "object") {
      folder = getFolderById(udata.safes, folder);
    }

    if (!folder) {
      folder = udata.safes[0];
    }
    setActiveFolderId(folder.id)
    axios
      .post(`${getApiUrl()}folder_ops.php`, {
        operation: "current_safe",
        verifier: getVerifier(),
        id: folder.id,
      })
  };

  // -----------------------

  const showCopyMoveToast = (operation) => {
    copyMoveOperation = operation;
    setShowToast("CopyMoveToast");
    enablePaste(true);
  }

  const hideCopyMoveToast = () => {
    setShowToast("");
    enablePaste(false);
  }

  const inMemoryView = (blob, filename) => {
    setPage("ViewFile");
    setFilename(filename);
    setBlob(blob);
    console.log("inMemory view", filename);
  };

  const gotoMain = () => {
    setPage("Main");
    setFilename("");
    setBlob(null);
  }

  const gotoIam = () => {
    setPage("Iam");
    setFilename("");
    setBlob(null);
  }

  return (
    <Container className="d-flex" style={{ flexDirection: "column" }}>
      <Header page={page}
        onSearchChange={e => setSearchString(e.target.value)}
        onSearchClear={() => setSearchString('')}
        searchString={searchString}
        gotoMain={gotoMain}
        gotoIam={gotoIam}
      >
      </Header>

      <Row className="mainRow">

        <ViewFile
          show={page === "ViewFile"}
          gotoMain={gotoMain}
          filename={filename}
          blob={blob}
        />

        <MainPage
          show={page === "Main"}
          safes={udata.safes}
          activeFolderId={activeFolderId}
          setActiveFolder={setActiveFolder}
          searchString={searchString}
          onSearchClear={() => setSearchString('')}
          showCopyMoveToast={showCopyMoveToast}
          hideCopyMoveToast={hideCopyMoveToast}

          inMemoryView={inMemoryView}
          key='main-page'>

        </MainPage>
        <UserManagementPage
          show={page === "Iam"}
          gotoMain={gotoMain}
        />
      </Row>
      <Row className="d-none d-sm-block">
        <div
          style={{
            height: "22px",
            display: (page === "Main" || page === "Iam") ? "" : "none",
          }}
        ></div>
      </Row>

      <ToastContainer style={{ bottom: 16, right: 16 }}>
        <CopyMoveToast
          show={showToast == "CopyMoveToast"}
          operation={copyMoveOperation}
          onClose={() => {
            enablePaste(false);
            setShowToast("");
          }}
        >
        </CopyMoveToast>
        <SurveyToast
          show={showToast === "takeSurveyToast"}
          onClose={(next) => {
            if (next == "showSurveyModal") {
              setShowModal("survey");
            }
            setShowToast("");
          }}
        ></SurveyToast>
      </ToastContainer>
      <SurveyModal
        show={showModal === "survey"}
        onClose={(dummy, next) => {
          setShowModal(next ? next : "");
        }}
      ></SurveyModal>

      <MessageModal
        show={showModal === "thank you"}
        thankyou
        onClose={() => {
          setShowModal("");
        }}
      ></MessageModal>

      <IdleModal
        show={showModal === "IdleModal"}
        onClose={() => {
          setShowModal("");
          restartIdleTimer();
        }}
      ></IdleModal>

    </Container>
  );
}

export default Root;
