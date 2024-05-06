import { useState } from 'react';
import axios from "axios";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import ModalCross from "./modalCross";

import InputField from "./inputField";
import { updateEmail } from '../lib/userData';

function VerifyEmailModal(props) {

  if (!props.show) {
    return null;
  }

  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const onCodeChange = (e) => {
    setCode(e.target.value);
    setErrorMsg("");
  };

  const contactUs = () => {
    props.onClose("dummy", "Contact us");
  };

  const onSubmit = () => {
    const _code = code.trim();
    console.log("Submit");
    if (_code.length == 0) {
      setErrorMsg("Please fill the code field");
      return;
    }

    axios
      .post("registration_action.php", {
        code6: _code,
        purpose: "change",
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          if ('email' in result) {
            updateEmail(result.email);
          }
          props.onClose();
          return;
        }
        setErrorMsg(result.status);
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Server error. Please try again later");
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
        <div className="h2">Check your mailbox</div>
      </div>

      <Modal.Body className="edit mb24">
        <div className="mb32">
          Please enter the code we’ve sent to{" "}
          <b>{props.emailToVerify}</b>
        </div>
        <InputField
          id="mailModalInput"
          label="Code"
          value={code}
          edit={true}
          onChange={onCodeChange}
        ></InputField>
        {errorMsg.length > 0 && (
          <div className="error-message">{errorMsg}</div>
        )}
        <div className="dark50">
          If you do not receive this email, please check your Spam folder,
          make sure the provided email address is correct, or{" "}
          <a style={{ color: "var(--link-color)" }} href="#" onClick={contactUs}>
            contact us
          </a>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Verify
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerifyEmailModal;
