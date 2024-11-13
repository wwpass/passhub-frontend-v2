import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

function GroupDeleteModal(props) {

  if (!props.show) {
    return null;
  }
  const [errorMsg, setErrorMsg] = useState("");

  const groupAction = (args) => {
    return axios
      .post(`${getApiUrl()}${args.url}`, args.args)
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
        setErrorMsg("Server error. Please try again later");
      });
  }

  const queryClient = useQueryClient();

  const groupMutation = useMutation({
    mutationFn: groupAction,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["userList"], exact: true })
    },
  })

  const onClose = () => props.onClose();

  const onSubmit = () => {

    groupMutation.mutate({
      url: 'group.php', args: {
        verifier: getVerifier(),
        operation: "delete",
        groupId: props.group.GroupID,
      }
    });
  }

  return (

    <Modal
      show={props.show}
      onHide={onClose}
      centered
      animation={false}
    >
      <ModalCross onClose={props.onClose}></ModalCross>

      <div className="modalTitle" style={{ alignItems: "center" }}>

        <div className="h2">Delete User Group</div>
      </div>

      <Modal.Body className="edit">
        <p>
          Do you really want to delete group{" "}
          <span style={{ fontSize: "larger", fontWeight: "bold" }}>
            {props.group.name}
          </span>{" "}
          ?        </p>
        {errorMsg.length > 0 && (
          <div style={{ color: "red" }}>{errorMsg}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="danger" type="submit" onClick={onSubmit}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GroupDeleteModal;
