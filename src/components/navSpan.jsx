
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import AccountDropDown from "./accountDropDown";
import ContactUsModal from "./contactUsModal";
import MessageModal from "./messageModal";
import UpgradeModal from "./upgradeModal";
import AccountModal from "./accountModal";
import ImportModal from "./importModal";
import ExportFolderModal from "./exportFolderModal";
import EmailModal from "./emailModal";
import VerifyEmailModal from "./verifyEmailModal";
import DeleteAccountModal from "./deleteAccountModal";
import DeleteAccountFinalModal from "./deleteAccountFinalModal";
import { getAccountData } from "../lib/userData";

function NavSpan(props) {

  const mockAccountData = {
    business: false,
    email: "mymail@gmail.com",
    plan: "FREE",
    totalStotrage: 1024 * 1024 * 10,
  };

  const [showModal, setShowModal] = useState("");
  const [accountData, setAccountData] = useState(mockAccountData);
  const [emailToVerify, setEmailToVerify] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["accountData"],

    queryFn: () => Promise.resolve(2).then(data => {
      // console.log(99);
      //      setCmtData(data);
      return data;
    }),
    onSuccess: () => {
      // console.log('success 44')
    }

  });

  if (isLoading) {
    // console.log('loading 46');
  } else if (error) {
    //  console.log('error 46', error);
  } else {
    // console.log('navSpan 48', data);
    if (getAccountData() != accountData) {
      //        console.log('setting state 55');
      setAccountData(getAccountData());
    }
  }

  const accountOperation = (newData) => {
    const axiosData = newData
      ? newData
      : {
        verifier: getVerifier(),
      };
    axios.post(`${getApiUrl()}account.php`, axiosData).then((reply) => {
      const result = reply.data;
      if (result.status === "Ok") {
        // self.setState({ accountData: result });
        return;
      }
      if (result.status === "login") {
        window.location.href = "expired.php";
        return;
      }
    });
  };

  const showAccountDropDown = (e) => {
    e.stopPropagation();
    setShowModal("AccountDropDown");
  };

  const handleMenuCommand = (cmd) => {
    if (cmd === "Contact us") {
      setShowModal("Contact us");
      return;
    }
    if (cmd === "Account settings") {
      setShowModal("Account settings");
      return;
    }
    if (cmd === "upgrade") {
      setShowModal("upgrade");
      return;
    }
    if (cmd === "Export") {
      setShowModal("Export");
      return;
    }
    if (cmd === "Import") {
      setShowModal("Import");
      return;
    }
    if (cmd === "Help") {
      window.open("https://passhub.net/doc", "passhub_doc", []);
      return;
    }
    if (cmd === "Iam") {
      props.gotoIam();
    }

    //    props.onMenuCommand(cmd);
  };

  const inputBackground = props.searchString.trim().length
    ? "white"
    : "rgba(255, 255, 255, 0.6)";

  return (
    <React.Fragment>
      {props.page === "Main" && (
        <div
          className="d-none d-sm-block"
          style={{
            flexGrow: 1,
            padding: "0 36px 0 40px",
            position: "relative",
          }}
        >
          <input
            className="search_string"
            type="text"
            placeholder="Search.."
            autoComplete="off"
            onChange={props.onSearchChange}
            value={props.searchString}
            style={{
              width: "100%",
              background: inputBackground,
              backdropFilter: "blur(40px)",
            }}
          />

          <span className="search_clear" onClick={props.onSearchClear}>
            <svg width="0.7em" height="0.7em" className="item_icon">
              <use href="#cross"></use>
            </svg>
          </span>
          <span style={{ position: "absolute", left: "55px", top: "10px" }}>
            <svg
              width="24"
              height="24"
              style={{
                opacity: 0.4,
                //verticalAlign: "text-bottom",
              }}
            >
              <use href="#f-search"></use>
            </svg>
          </span>
        </div>
      )}

      {props.page == "Iam" && (
        <div onClick={props.gotoMain} style={{ cursor: "pointer" }}>
          <svg width="32" height="32">
            <use href="#f-cross"></use>
          </svg>
        </div>
      )}

      {props.page !== "Login" && props.page !== "Iam" && (
        <React.Fragment>
          <div style={{ display: "flex" }}>
            <div className="account-dropdown-button"
              onClick={showAccountDropDown}
            //onClick={showAccountMenu}
            >
              <svg width="40" height="34" style={{ opacity: 0.8 }}>
                <use href="#f-account"></use>
              </svg>
            </div>
            <span
              className="d-none d-sm-inline"
              onClick={showAccountDropDown}
              style={{ padding: "8px 0 0 0", cursor: "pointer" }}
            >
              <svg width="24" height="24" fill="white">
                <use href="#angle"></use>
              </svg>
            </span>
          </div>
          <AccountDropDown
            show={showModal == "AccountDropDown"}
            onClose={() => setShowModal("")}
            onMenuCommand={handleMenuCommand}
            accountData={accountData}
          />

          <AccountModal
            show={showModal === "Account settings"}
            accountData={accountData}
            accountOperation={accountOperation}
            onClose={(dummy, next) => {
              setShowModal(next ? next : "");
            }}
          ></AccountModal>

          <DeleteAccountModal
            show={showModal === "delete account"}
            onClose={(dummy, next) => {
              setShowModal(next ? next : "");
            }}
          ></DeleteAccountModal>

          <DeleteAccountFinalModal
            show={showModal === "delete account final"}
            onClose={(dummy, next) => {
              setShowModal(next ? next : "");
            }}
          ></DeleteAccountFinalModal>

          <ContactUsModal
            show={showModal === "Contact us"}
            onClose={(dummy, next) => {
              setShowModal(next ? next : "");
            }}
          ></ContactUsModal>

          <MessageModal
            show={showModal === "success"}
            onClose={() => {
              setShowModal("");
            }}
          >
            Your message has been sent
          </MessageModal>

          <MessageModal
            show={showModal === "account deleted"}
            onClose={() => {
              setShowModal("");
              window.location.href = "logout.php";
            }}
          >
            Your account has been deleted
          </MessageModal>

          <UpgradeModal
            show={showModal === "upgrade"}
            onClose={() => {
              setShowModal("");
            }}
          ></UpgradeModal>

          <EmailModal
            show={showModal === "email"}
            onClose={(dummy, next, email) => {
              setShowModal(next ? "verifyEmail" : "");
              setEmailToVerify(email);
            }}
          ></EmailModal>

          <VerifyEmailModal
            show={showModal === "verifyEmail"}
            emailToVerify={emailToVerify}
            onClose={(dummy, next) => {
              setShowModal(next ? "Contact us" : "");
            }}
          ></VerifyEmailModal>

          <ImportModal
            show={showModal === "Import"}
            onClose={(dummy, next) => {
              setShowModal(next ? next : "");
            }}
          ></ImportModal>

          <ExportFolderModal
            show={showModal == "Export"}
            onClose={() => {
              setShowModal("")
            }}
          ></ExportFolderModal>

          { /* <AccountMenu /> */}


        </React.Fragment>
      )}


    </React.Fragment>
  );
}

export default NavSpan;




/*
            <ImportModal
                show={showModal === "Import"}
//                accountData={accountData}
//                getAccountData={getAccountData}
                onClose={(dummy, next) => {
                  setShowModal(next ? next : "");
                }}
            ></ImportModal>



  const showAccountMenu = (e) => {

    const btnNode = document.querySelector(".account-dropdown-button");

    const position = {
      // compute center x minus menu width
      x: btnNode.offsetLeft + btnNode.offsetWidth / 2 - 200,
      y: btnNode.offsetTop + btnNode.offsetHeight / 2
    };
    const bodyWidth = Math.floor(document.querySelector("body").getBoundingClientRect().width);

    e.preventDefault();
    contextMenu.show({ id: "account-menu-id", event: e, position, props: { bodyWidth, handleMenuCommand } });
    return;
  };



*/