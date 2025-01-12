import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";
import { getUserData } from "../lib/userData";

import InputField from "./inputField";
import TextAreaField from "./textAreaField";

import TextareaAutosize from "react-textarea-autosize";

import progress from "../lib/progress";

function InviteToShareMailModal(props) {

  if (!props.show) {
    return null;
  }

  const accountData = getUserData();
  const from = accountData.email;


  let template = `Hello, ${props.args.to}!

${from} wants to share a secure safe with you on PassHub.

Please follow ${window.location.origin} to create a free account. Share files and passwords securely with PassHub!
 `

  const [message, setMessage] = useState(template);
  const [errorMsg, setErrorMsg] = useState("");


  const onMessageChange = (e) => {
    setMessage(e.target.value);
    setErrorMsg("");
  };

  const onSubmit = () => {
    if (message.trim().length == 0) {
      setErrorMsg("please fill in the message field");
      return;
    }
    progress.lock();
    axios
      .post(`${getApiUrl()}send_mail.php`, {
        verifier: getVerifier(),
        to: props.args.to,
        subject: "Invitation to create a PassHub.net account",
        message,
      })
      .then((reply) => {
        progress.unlock();
        const result = reply.data;
        if (result.status === "Ok") {
          props.onClose(1, "success");
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
      })
      .catch((err) => {
        progress.unlock();
        setErrorMsg("Error sending email. Please try again later");
      });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      animation={false}
      centered
    >
      <ModalCross onClose={props.onClose}></ModalCross>
      <div className="modalTitle">
        <div className="h2">Send an invitation message</div>
      </div>
      <Modal.Body className="edit" style={{ marginBottom: "24px" }}>
        {errorMsg.length > 0 ? (
          <div style={{ color: "red", margin: "0 16px 16px" }}>
            <svg
              style={{
                width: "24px",
                height: "24px",
                fill: "red",
                marginRight: "16px",
              }}
            >
              <use href="#a-error"></use>
            </svg>
            {errorMsg}
          </div>
        ) : (
          ""
        )}

        <div style={{ margin: "0 0 12px 24px" }}>
          <b>To:</b> {props.args.to}
        </div>
        <div style={{ margin: "0 0 36px 24px" }}>
          <b>Subj:</b> Invitation to create a PassHub.net account
        </div>

        <div style={{ margin: "0 0 4px 24px", color: "grey" }}>
          You can edit the message below:
        </div>

        <div className="itemNoteModalField">
          <TextareaAutosize
            id="contact-us-message"
            value={message}
            onChange={onMessageChange}
            placeholder="Type message here"
          />
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="button" onClick={onSubmit}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InviteToShareMailModal;
