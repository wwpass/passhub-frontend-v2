import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import ModalCross from "./modalCross";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import CheckBox from "./checkBox";
// import generatePassword from "password-generator";
import generatePassword from "../lib/password-generator";

function GeneratePasswordModal(props) {
  /*  
    state = {
      passwordLength: 12,
      uppercase: true,
      lowercase: true,
      digits: true,
      specialChars: false,
      redoCount: 0,
    };
  */
  if (!props.show) {
    return null;
  }

  const [passwordLength, setPasswordLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [digits, setDigits] = useState(true);
  const [specialChars, setSpecialChars] = useState(false);
  const [redoCount, setRedoCount] = useState(0);

  let password = "";

  const onShow = () => {
    document.querySelector(".z-index-2040 + .modal").style["z-index"] = 2050;
  }

  const onSubmit = () => {
    props.onClose("dummy", password);
  };

  const updatePreferences = (change) => {

    const state = { passwordLength, uppercase, lowercase, digits, specialChars };
    const value = { ...state, ...change }

    axios
      .post(`${getApiUrl()}account.php`, {
        operation: "generator",
        verifier: getVerifier(),
        value
      })
  }

  const onSliderChange = (length) => {
    setPasswordLength(length);
    updatePreferences({ passwordLength: length });
  };

  const genPassword = () => {
    let len = passwordLength;
    if (len < 4) {
      len = 4;
    }
    const m = false; // $("#memorable").is(':checked');
    if (m) {
      return generatePassword(len, m);
    }

    let pattern = "";
    if (digits) {
      if (uppercase || lowercase) {
        pattern += "2-9";
      } else {
        pattern += "0-9";
      }
    }
    if (specialChars) {
      pattern += "!#$%&()*+:?@^{}";
    }
    if (lowercase) {
      pattern += "a-kmp-z";
    }
    if (uppercase) {
      pattern += "A-HJ-MPZ";
    }
    if (pattern == "") {
      pattern = "A-HJ-MPZa-kmp-z";
    }
    pattern = "[" + pattern + "]";
    let p = generatePassword(len, m, pattern);
    for (let i = 0; i < 100; i++) {
      let redo = false;
      if (digits) {
        if (!p.match(/[0-9]/)) {
          redo = true;
        }
      } else if (uppercase) {
        if (!p.match(/[A-HJ-MPZ]/)) {
          redo = true;
        }
      } else if (lowercase) {
        if (!p.match(/[a-kmp-z]/)) {
          redo = true;
        }
      }
      if (!redo) {
        break;
      }
      p = generatePassword(len, m, pattern);
    }
    return p;
  };


  password = genPassword();

  return (
    <Modal
      show={props.show}
      onShow={onShow}
      onHide={props.onClose}
      animation={false}
      backdropClassName="z-index-2040"
      contentClassName="z-index-2050"
      centered
    >
      <ModalCross onClose={props.onClose}></ModalCross>
      <div className="modalTitle">
        <div className="h2">Password generator</div>
      </div>
      <Modal.Body className="edit mb32">
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            style={{
              border: "none",
              borderBottom: "1px solid var(--edit-item-modal-field-border)",
              flexGrow: 1,
              marginRight: "1em",
              outline: "none",
              color: "var(--body-color)",
              background: "var(--modal-background)",
            }}
            value={password}
            readOnly
            spellCheck={false}
          />
          <svg
            width="64"
            height="40"
            fill="none"
            cursor="pointer"
            onClick={() => setRedoCount(redoCount + 1)}
          >
            <use href="#f-arrow-clockwise"></use>
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginRight: "1em" }}>Length:</div>
          <Slider
            value={passwordLength}
            step={1}
            min={6}
            max={32}
            onChange={onSliderChange}
            trackStyle={{ background: "#00BC62" }}
            handleStyle={{ borderColor: "#00BC62" }}
          ></Slider>
          <div style={{ marginLeft: "1em" }}>{passwordLength}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <CheckBox
            checked={uppercase}
            onClick={() => { updatePreferences({ uppercase: !uppercase }); setUppercase(!uppercase) }}
          >
            Uppercase
          </CheckBox>
          <CheckBox
            checked={digits}
            onClick={() => { updatePreferences({ digits: !digits }); setDigits(!digits) }}
          >
            Digits
          </CheckBox>
        </div>


        <div style={{ display: "flex", flexWrap: "wrap" }}>


          <CheckBox
            checked={lowercase}
            onClick={() => { updatePreferences({ lowercase: !lowercase }); setLowercase(!lowercase) }}
          >
            Lowercase
          </CheckBox>

          <CheckBox
            checked={specialChars}
            onClick={() => { updatePreferences({ specialChars: !specialChars }); setSpecialChars(!specialChars) }}
          >
            Special characters
          </CheckBox>
        </div>



      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>

    </Modal>

  );
}

export default GeneratePasswordModal;

