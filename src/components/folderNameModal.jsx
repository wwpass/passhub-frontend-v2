import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import ModalCross from "./modalCross";
import InputField from "./inputField";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import * as passhubCrypto from "../lib/crypto";

function FolderNameModal(props) {

  if (!props.show) {
    return null;
  }

  const folderAction = (args) => {
    // console.log('folder Action: url', args.url,  'args', args.args);
    return axios
      .post(`${getApiUrl()}${args.url}`, args.args)
      .then((response) => {
        const result = response.data;

        if (result.status === "Ok") {
          props.onClose(true, result.id);
          return "Ok";
        }

        if (result.status === "group safe") {
          props.onClose(result.status);
          return "Ok";
        }

        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
        return;
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Server error. Please try again later" );
      });
  }

  const queryClient = useQueryClient();

  const folderMutation = useMutation({
    mutationFn: folderAction,
    onSuccess: data => {
      queryClient.invalidateQueries(["userData"], { exact: true })
    },
  })

  const [name, setName] = useState(props.args.folder? props.args.folder.path[props.args.folder.path.length - 1][0] : "");
  const [errorMsg, setErrorMsg]  = useState("");

  let title = "";

  const onClose = () => {
    props.onClose();
  };

  const onSubmit = () => {
    //console.log(`submit ${title}`);
    const _name = name.trim();
    if (_name.length == 0) {
      setName(_name);
      setErrorMsg("* Please fill in the name field");
      return;
    }

    if (title == "Create Safe") {

      const safe = passhubCrypto.createSafe(_name);

      folderMutation.mutate({url: 'create_safe.php', args: {
        verifier: getVerifier(),
        safe,
      }});
      return;
    }

    if (title == "Create Folder") {
      const parent = props.args.parent;
/*
      const [eAesKey, SafeID, folderID] = parent.safe
      ? [parent.safe.key, parent.safe.id, parent.id]
      : [parent.key, parent.id, 0];
*/
      const [aesKey, SafeID, folderID] = parent.safe
      ? [parent.safe.bstringKey, parent.safe.id, parent.id]
      : [parent.bstringKey, parent.id, 0];


      const eFolderName = passhubCrypto.encryptFolderName(_name, aesKey);

      folderMutation.mutate({url: 'folder_ops.php', args: {
        operation: "create",
        verifier: getVerifier(),
        SafeID,
        folderID,
        name: eFolderName,
      }});

      /*
      passhubCrypto.decryptAesKey(eAesKey).then((aesKey) => {
        const eFolderName = passhubCrypto.encryptFolderName(_name, aesKey);

        folderMutation.mutate({url: 'folder_ops.php', args: {
          operation: "create",
          verifier: getVerifier(),
          SafeID,
          folderID,
          name: eFolderName,
        }});
      })
*/

      return;
    }

    // rename
    
    let prevName =
      props.args.folder.path[props.args.folder.path.length - 1][0];
    if (prevName == name) {
      props.onClose();
      return;
    }

    if (title == "Rename Safe") {
      const eName = passhubCrypto.encryptSafeName(
        _name,
        props.args.folder.bstringKey
      );      
      folderMutation.mutate({url: 'update_vault.php', args: {
        vault: props.args.folder.id,
        verifier: getVerifier(),
        eName,
        version: 3,
      }});
     
      return;
    }
    
    if (title == "Rename Folder") {

      const eFolderName = passhubCrypto.encryptFolderName(_name, props.args.folder.safe.bstringKey);
      folderMutation.mutate({url: 'folder_ops.php', args: {
        operation: "rename",
        verifier: getVerifier(),
        SafeID: props.args.folder.safe.id,
        folderID: props.args.folder.id,
        name: eFolderName,
      }})



/*
      passhubCrypto.decryptAesKey(props.args.folder.safe.key)
      .then((aesKey) => {
        const eFolderName = passhubCrypto.encryptFolderName(_name, aesKey);
        folderMutation.mutate({url: 'folder_ops.php', args: {
          operation: "rename",
          verifier: getVerifier(),
          SafeID: props.args.folder.safe.id,
          folderID: props.args.folder.id,
          name: eFolderName,
        }})
      })
*/

      return;
    }
  };

  const handleChange = (e) => {
    setName(e.target.value);
    setErrorMsg("");
  }

  const keyUp = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  title = "Create";
  let icon = "#f-safe";
  let titleClass = "safe-name-title";
  let placeHolder = "";

  if (props.args.folder) {
    [title, icon, titleClass, placeHolder] =
      props.args.folder.path.length < 2
        ? ["Rename Safe", "#f-safe", "safe-name-title", "Safe name"]
        : ["Rename Folder", "#f-folderSimplePlus", "", "Folder name"];
  } else {
    [title, icon, titleClass, placeHolder] = props.args.parent
      ? ["Create Folder", "#f-folderSimplePlus", "", "Folder name"]
      : ["Create Safe", "#f-safe", "safe-name-title", "Safe name"];
  }

  let path = "";
  if (props.args.parent) {
    path = props.args.parent.path.map((e) => e[0]).join(" > ");
  } else if (props.args.folder) {
    if (props.args.folder.path.length > 1) {
      path = props.args.folder.path
        .slice(0, -1)
        .map((e) => e[0])
        .join(" > ");
    }
  }

    return (
      <Modal
        show={props.show}
        onHide={onClose}
        animation={false}
        centered
      >
        <ModalCross onClose={props.onClose}></ModalCross>
        {path.length > 0 && false && (
          <div className="itemModalPath d-none d-sm-block">{path}</div>
        )}

        <div className="modalTitle" style={{ alignItems: "center" }}>
          <div>
            <svg width="32" height="32" style={{ marginRight: "14px" }}>
              <use href={icon}></use>
            </svg>
          </div>

          <div className="h2">{title}</div>
        </div>
        {title == "Create Safe" && <div>Shareable top-level folder</div>}

        <Modal.Body className="edit">
          <InputField
            id="folderNameModalInput"
            label="Name"
            value={name}
            edit
            autoFocus
            placeHolder={placeHolder}
            onChange={handleChange}
            onKeyUp={keyUp}
          ></InputField>
          {errorMsg.length > 0 && (
            <div style={{ color: "red" }}>{errorMsg}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" onClick={onSubmit}>
            {props.args.folder ? "Rename" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default FolderNameModal;

/*
  const createSafe = (safeName) => {
    const safe = passhubCrypto.createSafe(safeName);
    console.log(safe);
    return axios
      .post(`${getApiUrl()}create_safe.php`, {
        verifier: getVerifier(),
        safe,
      })
      .then((response) => {
        const result = response.data;

        if (result.status === "Ok") {
          props.onClose(true, result.id);
          return "Ok";
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
        return;
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Server error. Please try again later" );
      });
  };

*/

/*  
  const createSafeMutation = useMutation({
    mutationFn: createSafe,
    onSuccess: data => {
      queryClient.invalidateQueries(["userData"], { exact: true })
    },
  })
*/

/*
  const createSafe1 = (safeName) => {
    const safe = passhubCrypto.createSafe(safeName);
    console.log(safe);
    return axios
      .post(`${getApiUrl()}create_safe.php`, {
        verifier: getVerifier(),
        safe,
      })
      .then((response) => {
        const result = response.data;

        if (result.status === "Ok") {
          props.onClose(true, result.id);
          return "Ok";
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
        return;
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Server error. Please try again later" );
      });
  };
*/  
/*
const renameFolder = (newName) => {
  passhubCrypto
    .decryptAesKey(props.args.folder.safe.key)
    .then((aesKey) => {
      const eFolderName = passhubCrypto.encryptFolderName(newName, aesKey);
      axios
        .post(`${getApiUrl()}folder_ops.php`, {
          operation: "rename",
          verifier: getVerifier(),
          SafeID: props.args.folder.safe.id,
          folderID: props.args.folder.id,
          name: eFolderName,
        })
        .then((response) => {
          const result = response.data;
          if (result.status === "Ok") {
            props.onClose(true);
            return;
          }
          if (result.status === "login") {
            window.location.href = "expired.php";
            return;
          }
          setErrorMsg(result.status);
          return;
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg("Server error. Please try again later");
        });
    });
};
*/
/*
const createFolder = (parent, folderName) => {
  const [eAesKey, SafeID, folderID] = parent.safe
    ? [parent.safe.key, parent.safe.id, parent.id]
    : [parent.key, parent.id, 0];

  passhubCrypto.decryptAesKey(eAesKey).then((aesKey) => {
    const eFolderName = passhubCrypto.encryptFolderName(folderName, aesKey);
    axios
      .post(`${getApiUrl()}folder_ops.php`, {
        operation: "create",
        verifier: getVerifier(),
        SafeID,
        folderID,
        name: eFolderName,
      })
      .then((response) => {
        const result = response.data;
        if (result.status === "Ok") {
          // safes.setNewFolderID(result.id);
          props.onClose(true, result.id);
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Server error. Please try again later");
      });
  });
};
*/

/*

  const renameSafe = (newName) => {
    const eName = passhubCrypto.encryptSafeName(
      newName,
      props.args.folder.bstringKey
    );
    axios
      .post(`${getApiUrl()}update_vault.php`, {
        vault: props.args.folder.id,
        verifier: getVerifier(),
        eName,
        version: 3,
      })
      .then((response) => {
        const result = response.data;
        if (result.status === "Ok") {
          props.onClose(true);
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
      })
      .catch(() => {
        setErrorMsg("Server error. Please try again later");
      });
  };

*/
/*
const textInput = React.createRef();
*/
