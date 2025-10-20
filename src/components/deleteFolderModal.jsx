import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";


let stats = {};


function DeleteFolderModal(props) {

  if (!props.show) {
    return null;
  }

  const [phase, setPhase] = useState("initial");
  const [errorMsg, setErrorMsg] = useState("");

  const queryClient = useQueryClient();

  const deleteFolderMutation = useMutation({
    mutationFn: () => Promise.resolve(2),
    onSuccess: data => {
    },
    onError: data => {
      console.log('Hello 40');
      console.log('mutation error', data);
    },
    onSettled: data => {
      queryClient.invalidateQueries({ queryKey: ["userData"], exact: true })
    },
  })

  const onClose = (refresh = false) => {
    setPhase("initial");
    if (refresh) {
      deleteFolderMutation.mutate();
      props.onClose(true);
      return;
    }
    props.onClose(false);
  };
  const onCancel = () => onClose();

  const onUnsubscribe = () => {
    axios
      .post(`${getApiUrl()}safe_acl.php`, {
        verifier: getVerifier(),
        vault: props.folder.id,
        operation: "unsubscribe",
      })
      .then((reply) => {
        const result = reply.data;
        onClose(true);
        return;
      })
      .catch((err) => {
        setErrorMsg("Server error. Please try again later");
      });
  };

  const onSubmit = () => {
    if (phase === "safeDeleted") {
      onClose(true);
      return;
    }

    if (phase === "unsubscribe") {
      onUnsubscribe();
      return;
    }

    const operation =
      phase === "notEmptyFolderWarning"
        ? "delete_not_empty"
        : "delete";

    const verifier = getVerifier();

    let uri = "delete_safe.php";
    let args = {
      operation,
      verifier,
      SafeID: props.folder.id,
    };

    if (props.folder.path.length > 1) {
      // folder
      uri = "folder_ops.php";
      args = {
        operation,
        verifier,
        SafeID: props.folder.SafeID,
        folderID: props.folder.id,
      };
    }

    axios
      .post(`${getApiUrl()}${uri}`, args)
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          if (result.hasOwnProperty("items")) {
            stats = result;
            setPhase("safeDeleted");
            return;
          }
          onClose(true);
          return;
        }

        if (result.status === "not empty") {
          setPhase("notEmptyFolderWarning");
          return;
        }

        if ((result.status === "group safe") || (result.status === "group safe, siteadmin")) {
          setPhase("initial");
          props.onClose(result.status);
          return;
        }

        if (result.status === "unsubscribe") {
          setPhase("unsubscribe");
          return;
        }

        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
        return;
      })
      .catch((error) => {
        console.log(error);
        setErrorMsg("Server error. Please try again later");
      });
  };

  const folderName =
    props.folder.path[props.folder.path.length - 1][0];
  const isSafe = props.folder.path.length < 2;
  const folderType = isSafe ? "Safe" : "Folder";

  const showSecondary = phase !== "safeDeleted";

  return (
    <Modal
      show={props.show}
      onHide={onCancel}
      centered
      animation={false}
    >
      <ModalCross onClose={onCancel}></ModalCross>
      <div className="modalTitle">
        <div className="h2">Delete {folderType}</div>
      </div>

      <Modal.Body>
        {phase === "initial" && (
          <p>
            Do you really want to delete{" "}
            <span style={{ fontSize: "larger", fontWeight: "bold" }}>
              {folderName}
            </span>{" "}
            ?
          </p>
        )}
        {phase === "notEmptyFolderWarning" && (
          <p>
            The {folderType}{" "}
            <span style={{ fontSize: "larger", fontWeight: "bold" }}>
              {folderName}
            </span>{" "}
            is not empty. Do you want to delete it with all its items and
            subfolders?
          </p>
        )}
        {phase === "unsubscribe" && (
          <div>
            <p>You are not the safe owner, you cannot delete the safe.</p>
            <p>
              Still you can cancel your membership by clicking 'unsubscribe'
              button
            </p>
          </div>
        )}
        {phase === "safeDeleted" && (
          <div>
            Deleted folders: {stats.folders} items: {stats.items}
          </div>
        )}
        {errorMsg.length > 0 && (
          <div style={{ color: "red" }}>{errorMsg}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {showSecondary && (
          <Button variant="outline-secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="danger"
          type="submit"
          onClick={() => onSubmit()}
        >
          {phase === "initial" && "Delete"}
          {phase === "notEmptyFolderWarning" && "Delete"}
          {phase === "safeDeleted" && "Close"}
          {phase === "unsubscribe" && "Unsubscribe"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteFolderModal;
