import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ModalCross from "./modalCross";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import InputField from "./inputField";

import TextareaAutosize from "react-textarea-autosize";

import progress from "../lib/progress";

function SurveyModal(props) {

  if (!props.show) {
    // setState({ name: "", email: "", message: "", errorMsg: "" });
    return null;
  }

  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");
  const [other, setOther] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [addDesktop, setAddDesktop] = useState(false);
  const [addMobile, setAddMobile] = useState(false);

  const onStrengthChange = (e) => {
    setStrength(e.target.value);
    setErrorMsg("");
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const onWeaknessChange = (e) => {
    setWeakness(e.target.value);
    setErrorMsg("");
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const onOtherChange = (e) => {
    setOther(e.target.value);
    setErrorMsg("");
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMsg("");
  };

  const handleAddDesktop = (e) => {
    setAddDesktop(e.target.checked);
  };

  const handleAddMobile = (e) => {
    setAddMobile(e.target.checked);
  };

  const onSubmit = () => {
    progress.lock();
    axios
      .post(`${getApiUrl()}survey.php`, {
        verifier: getVerifier(),
        email: email.trim(),

        best: strength.trim(),
        improve: weakness.trim(),
        other_pm: other.trim(),

        add_desktop: addDesktop,
        add_mobile: addMobile,
      })
      .then((reply) => {
        progress.unlock();
        const result = reply.data;
        if (result.status === "Ok") {
          props.onClose(1, "thank you");
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
        <div className="h2">PassHub.net Survey</div>
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

        <p>
          Your responses to this survey will help us better understand your
          experience with the PassHub.net. Thank You!
        </p>

        <p>What do you like best about PassHub?</p>

        <div className="itemNoteModalField edit">
          <TextareaAutosize
            value={strength}
            id="strength"
            onChange={onStrengthChange}
            edit
            minRows={2}
          ></TextareaAutosize>
        </div>

        <p>What can we do to improve PassHub?</p>

        <div className="itemNoteModalField edit">
          <TextareaAutosize
            value={weakness}
            id="weakness"
            onChange={onWeaknessChange}
            edit
            minRows={2}
          ></TextareaAutosize>
        </div>

        <p>
          What are the other password managers PassHub needs to be
          interoperable with (import/export)?
        </p>
        <InputField
          value={other}
          id="survey-other-pm"
          onChange={onOtherChange}
          edit
        ></InputField>

        <p style={{ marginBottom: 0 }}>
          What are the features you want to see in PassHub?
        </p>

        <div>
          <Form.Group

            style={{ border: "none" }}
          >
            <Form.Check
              type="checkbox"
              id="desktop-application"
              label="Desktop Application"
              checked={addDesktop}
              onChange={handleAddDesktop}
            />
            <Form.Check
              type="checkbox"
              id="mobile-application"
              label="Mobile Application"
              checked={addMobile}
              onChange={handleAddMobile}
            />
          </Form.Group>
        </div>
        <p>Your contact email (optional)</p>
        <InputField
          value={email}
          id="survey-email"
          onChange={onEmailChange}
          edit
        ></InputField>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="button" onClick={onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SurveyModal;

/*
controlId="formBasicCheckbox"
*/