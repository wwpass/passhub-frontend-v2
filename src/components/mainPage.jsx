// import React from "react";
import React, { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ToastContainer from 'react-bootstrap/ToastContainer'

import axios from "axios";

import FolderNameModal from "./folderNameModal";
import DeleteFolderModal from "./deleteFolderModal";
import ExportFolderModal from "./exportFolderModal";
import ShareModal from "./shareModal";
import MessageModal from "./messageModal";
import CopyMoveToast from './copyMoveToast';

// import IdleTimer from "react-idle-timer";
import WsConnection from "../lib/wsConnection";
// import * as passhubCrypto from "../lib/crypto";
import {
    getFolderById,
    getApiUrl,
    getWsUrl,
    getVerifier,
    serverLog,
    enablePaste
  } from "../lib/utils";

import * as dropAndPaste from "../lib/dropAndPaste";
import {search, searchFolders} from "../lib/search";

import SafePane from "./safePane";
import TablePane from "./tablePane";

function MainPage (props) {

  if(!props) {
    return null;
  }

  if(!props.show) {
    return null;
  }

  if(!props.safes) {
    return null;
  }

  if(props.safes.length == 0) {
    return null;
  }

  let _activeFolder = getFolderById(props.safes, props.currentSafe);

  if (_activeFolder === null) {
    console.log("recommended activesafe not found");
    _activeFolder = props.safes[0];
  }

  const [openNodes, setOpenNodes] = useState(new Set());
  const [activeFolder, setActiveFolder] = useState(_activeFolder);

  const [showModal, setShowModal] = useState("");
  const [showToast, setShowToast] = useState("");
  const [copyMoveToastOperation, setCopyMoveToastOperation] = useState("nop");

  // not a state below, useMemo?

  const [folderNameModalArgs, setFolderNameModalArgs] = useState({});
  const [deleteFolderModalArgs, setDeleteFolderModalArgs] = useState({});
  const [exportFolderModalArgs, setExportFolderModalArgs] = useState({});
  const [shareModalArgs, setShareModalArgs] = useState(null);
  const [messageModalArgs, setMessageModalArgs] = useState(null);


//// 

  // const [idleTimeoutAlert, setIdleTimerAlert] = useState(false);

  //const [goPremium, setGoPremium] = useState(false);
  //const [takeSurvey, setTakeSurvey] = useState(true);
  // const [plan, setPlan] = useState("FREE");

/*
  useEffect(() => {
    console.log("MainPage has been mounted");
    return () => console.log("MainPage has been unmounted")
    },  []);
*/

  useEffect(() => {
      setActiveFolder1(props.currentSafe);
  },  [props.safes]);


  const queryClient = useQueryClient();


  const cmtResult = useQuery({
    queryKey: ["copyMoveToast"],
    queryFn: () => Promise.resolve(2).then(data => {
      return data;
    }),
   });  
  
  const cmtData = cmtResult.data;

  useEffect(() =>{

    if( (typeof cmtData == "object") && ("item" in cmtData) && ("operation" in cmtData)) {
      setCopyMoveToastOperation(cmtData.operation);
      props.showCopyMoveToast(cmtData.operation);
      enablePaste(true);

      /*
      if(showToast != "CopyMoveToast") {
        setShowToast("CopyMoveToast");
        console.log(cmtData);
      }
      */
    } 
  }, [cmtData])


  // move item processing

  const copyMoveMutation = useMutation({
    mutationFn: (_args) => {
      const { node, pItem, operation } = _args;
      return dropAndPaste.doMove(props.safes, node, pItem, operation);
    },    
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["userData"], { exact: true })
    },
    onError: (err, variables, context) => {
      if(err.message == "no dst write") {
        setShowModal("NoRightsModal");
        setMessageModalArgs({
          message:
            'Sorry, "Paste" is forbidden. You have only read access to the destination safe.',
        })
        return;
      }
      if(err.message == "no src write") {
        setShowModal("NoRightsModal");
        setMessageModalArgs({
          message:
            'Sorry, "Move" operation is forbidden. You have only read access to the source safe.',
        })
        return;
      }
    }
  })

  const dropItem = (node, pItem) => {
    copyMoveMutation.mutate({node, pItem, operation: "move"});
  };

  //////////  end of move item processing

  const folderMenuCmd = (node, cmd) => {

    if (cmd === "add safe") {
      setFolderNameModalArgs({});
      setShowModal("FolderNameModal");
      return;
    }
/*
    if(node.group) {
      setShowModal("groupSafeModal");
      setMessageModalArgs({
        message:
          'Sorry, operation forbidden. The safe is owned by company. Consult site administratior.',
      })
    }
*/

    if (cmd === "rename") {
      setShowModal("FolderNameModal");
      setFolderNameModalArgs({ folder: node });
      return;
    }

    if (cmd === "Add folder") {
      setShowModal("FolderNameModal");
      setFolderNameModalArgs({ parent: node });
      return;
    }

    if (cmd === "delete") {
      // modalKey++;
      setShowModal("DeleteFolderModal");
      setDeleteFolderModalArgs(node);
      return;
    }

    if (cmd === "export") {
      if(node.user_role == "limited view") {
        console.log('limited view safe not exported');
        return;
      }

      if(node.safe && (node.safe.user_role == "limited view")) {
        console.log('limited view folder not exported');
        return;
      }

      setShowModal("ExportFolderModal");
      setExportFolderModalArgs(node);
      return;
    }
    
    if (cmd === "Share") {
      setShowModal("ShareModal");
      setShareModalArgs({ folder: node, email: props.email });
    }
    if (cmd === "Paste") {
     
      if( (typeof cmtData == "object") && ("item" in cmtData) && ("operation" in cmtData)) {
        copyMoveMutation.mutate({node, pItem: cmtData.item, operation: copyMoveToastOperation}); 
      }
      props.hideCopyMoveToast();
/*      
      if(showToast == "CopyMoveToast") {
        setShowToast("");
        enablePaste(false);
      }
*/      
//      props.paste(node);
    }
  }

  const setActiveFolder1 = (folder) => {
    props.onSearchClear();

    if (typeof folder !== "object") {
      folder = getFolderById(props.safes, folder);
    }
    if(!folder) {
      folder = props.safes[0];
    }

    if (folder.SafeID) {
      // isFolder
      const openNodesCopy = new Set(openNodes);
      let parentID = folder.parent;
      while (parentID != 0) {
        if (!openNodes.has(parentID)) {
          openNodesCopy.add(parentID);
        }
        let parentFolder = getFolderById(props.safes, parentID);
        parentID = parentFolder.parent;
      }
      if (!openNodes.has(folder.SafeID)) {
        openNodesCopy.add(folder.SafeID);
      }
      setOpenNodes(openNodesCopy);
    }
  //  this.userDataJustLoaded = true;
  
    setActiveFolder(folder);
    axios
    .post(`${getApiUrl()}folder_ops.php`, {
      operation: "current_safe",
      verifier: getVerifier(),
      id: folder.id,

//      id: folder.SafeID ? folder.SafeID : folder.id,
    })    
  };



    const handleOpenFolder = (folder) => {
      const openNodesCopy = new Set(openNodes);
      if (openNodes.has(folder.id)) {
        openNodesCopy.delete(folder.id);
      } else {
        openNodesCopy.add(folder.id);
      }
      setOpenNodes(openNodesCopy);
    };

    const openParentFolder = (folder) => {
      if (!folder.SafeID) {
        return;
      }
      if (folder.parent == 0) {
        setActiveFolder1(folder.safe);
      } else {
        const parent = getFolderById(props.safes, folder.parent);
        setActiveFolder1(parent);
      }
    };    

// search processing    

  let searchFolder = {
    path: [["Search results", 0]],
    folders: [],
    items: [],
  };

  const searchString = props.searchString.trim();
  if (searchString.length > 0) {
    searchFolder.items = search(searchString);
    searchFolder.folders = searchFolders(searchString);

    const safePane = document.querySelector("#safe_pane");

    if (safePane && !safePane.classList.contains("d-none")) {
      document.querySelector("#safe_pane").classList.add("d-none");
      document.querySelector("#table_pane").classList.remove("d-none");
    }
  }  

  const handleCopyMove = (item, operation) => {
    console.log("Copy Move operation", operation);
  }

///////////////////////////////////////////////

    return (
        <React.Fragment>
            <SafePane 
                show = {true}
                safes = {props.safes}
                openNodes = {openNodes}
                activeFolder = {activeFolder}
                setActiveFolder = {setActiveFolder1}
                onFolderMenuCmd = {folderMenuCmd}
                handleOpenFolder = {handleOpenFolder}
                dropItem={dropItem} 
                />
            <TablePane
                safes = {props.safes}
                inMemoryView = {props.inMemoryView}
                setActiveFolder={setActiveFolder1}

                onFolderMenuCmd = {folderMenuCmd}
                openParentFolder={openParentFolder}

                dropItem={dropItem} 

                folder={ 
                  searchString.length > 0
                    ? searchFolder 
                    : activeFolder
                  }
                  searchMode={searchString.length > 0}
              />

            <FolderNameModal
              show={showModal == "FolderNameModal"}
              args={folderNameModalArgs}
              onClose={(result = false, newFolderID) => {

                if(result == "group safe") {
                  setMessageModalArgs({
                    message:
                      'Sorry, the operation is forbidden. The safe is owned by company. Consult site administratior.',
                  })
                  setShowModal("groupSafeModal")
                  return;
                }

                setShowModal("");
              }}
            ></FolderNameModal>

            <ShareModal
              show={showModal == "ShareModal"}
              args={shareModalArgs}
              onClose={(result = false) => {

                if(result == "group safe") {
                  setMessageModalArgs({
                    message:
                      'Sorry, the operation is forbidden. The safe is owned by company. Consult site administratior.',
                  })
                  setShowModal("groupSafeModal")
                  return;
                }

                if(result == "group safe, siteadmin") {
                  setMessageModalArgs({
                    message:
                      'Sorry, the operation is forbidden. The safe belongs to one or more groups. Please use site admin tools to share the safe',
                  })
                  setShowModal("groupSafeModal")
                  return;
                }

                setShowModal("");
                if (result === true) {
                  props.refreshUserData();
                }
              }}
            ></ShareModal>

            <DeleteFolderModal
              show={showModal == "DeleteFolderModal"}
              folder={deleteFolderModalArgs}
              onClose={(result = false) => {
                if(result=="refresh") {
                  props.refreshUserData();
                  return;
                }

                if(result == "group safe") {
                    setMessageModalArgs({
                      message:
                        'Sorry, the operation is forbidden. The safe is owned by company. Consult site administratior.',
                    })
                  setShowModal("groupSafeModal")
                  return;
                }

                if(result == "group safe, siteadmin") {
                  setMessageModalArgs({
                    message:
                      'Sorry, the operation is forbidden. The safe belongs to one or more groups. Please remove the safe from all the groups first',
                  })
                  setShowModal("groupSafeModal")
                  return;
                }

                setShowModal("")
              }}
            ></DeleteFolderModal>            

            <ExportFolderModal
              show={showModal == "ExportFolderModal"}
              folder={exportFolderModalArgs}
              onClose={() => {
                setShowModal("")
              }}
            ></ExportFolderModal>


            <MessageModal
              show={showModal == "NoRightsModal"}
              norights
              onClose={() => {
                setShowModal("");
              }}
            >
              {messageModalArgs && messageModalArgs.message}
            </MessageModal>

            <MessageModal
              show={showModal == "groupSafeModal"}
              norights
              onClose={() => {
                setShowModal("");
              }}
            >
              {messageModalArgs && messageModalArgs.message}
            </MessageModal>




            <ToastContainer position="bottom-end" style={{bottom:32, right:32}}>
              <CopyMoveToast
                show={showToast == "CopyMoveToast"}
                operation={copyMoveToastOperation}
                onClose={() => {
                  setShowToast("");
                  enablePaste(false);
                }}
              >
              </CopyMoveToast>
            </ToastContainer>
        </React.Fragment>
    );
}

export default MainPage;

