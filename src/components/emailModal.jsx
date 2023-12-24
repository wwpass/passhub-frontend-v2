import React, {useState} from "react";
import axios from "axios";
import { getApiUrl, getVerifier, getHostname } from "../lib/utils";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

import InputField from "./inputField";

import progress from "../lib/progress";

import { getAccountData } from "../lib/userData";

function EmailModal(props) {

  if (!props.show) {
    return null;
  }

  const accountData = getAccountData();

  const [email, setEmail] =  useState(accountData.email? accountData.email: "");
  const [errorMsg, setErrorMsg] =  useState("");

  const onSubmit = () => {
    const _email = email.trim();
    if (_email.length == 0) {
      setErrorMsg("Please fill the email field");
      return;
    }
    progress.lock();
    axios
      .post(`${getApiUrl()}change_mail.php`, {
        verifier: getVerifier(),
        email: _email,
        host: getHostname(),
      })
      .then((reply) => {
        progress.unlock();
        const result = reply.data;
        if (result.status === "Ok") {
          props.onClose("dummy", "verifyEmail", email);
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
        setErrorMsg("Server error. Please try again later");
      });
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMsg("");
  };


    let title = "Add your email address";
    if (
      accountData.email &&
      accountData.email.length > 0
    ) {
      title = "Change email address";
    }
    return (
      <Modal
        show={props.show}
        onHide={props.onClose}
        animation={false}
        centered
      >
        <ModalCross onClose={props.onClose}></ModalCross>
        <div className="modalTitle">
          <div className="h2">{title}</div>
        </div>

        <Modal.Body className="edit mb32">
          <InputField
            id="mailModalInput"
            label="Email"
            value={email}
            edit={true}
            onChange={onEmailChange}
          ></InputField>
          {errorMsg.length > 0 && (
            <div className="error">{errorMsg}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default EmailModal;
