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

import { getUserData, setGeneratorConfig } from "../lib/userData";

function GeneratePasswordModal(props) {

  if (!props.show) {
    return null;
  }

  const specialCharset0 = "!#$%&()*+:?@^{}";
  const allSpecialChars = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

  const ud = getUserData();

  const generator = ("generator" in ud) ? ud.generator : {
    passwordLength: 12,
    uppercase: true,
    lowercase: true,
    digits: true,
    specialChars: false,
    specialCharset: specialCharset0,
  };

  const [passwordLength, setPasswordLength] = useState(generator.passwordLength);
  const [uppercase, setUppercase] = useState(generator.uppercase);
  const [lowercase, setLowercase] = useState(generator.lowercase);
  const [digits, setDigits] = useState(generator.digits);
  const [specialChars, setSpecialChars] = useState(generator.specialChars);
  const [redoCount, setRedoCount] = useState(0);

  const [specialCharset, setSpecialCharset] = useState(generator.specialCharset ? generator.specialCharset : specialCharset0);
  const [changed, setChanged] = useState(false);


  let password = "";

  const onShow = () => {
    document.querySelector(".z-index-2040 + .modal").style["z-index"] = 2050;
  }

  const onSubmit = () => {
    props.onClose("dummy", password);
  };

  const rememberConfig = () => {
    const value = { passwordLength, uppercase, lowercase, digits, specialChars, specialCharset };
    setGeneratorConfig(value);
    setChanged(false);
    axios
      .post(`${getApiUrl()}account.php`, {
        operation: "generator",
        verifier: getVerifier(),
        value
      })
  }

  const onSliderChange = (length) => {
    setChanged(true);
    setPasswordLength(length);
  };


  const escapeSquareBrackets = (str) => {
    let result = "";
    str.split("").forEach((char) => {
      if ((char == "[") || (char == "]") || (char == "^") || (char == "-") || (char == "\\")) {
        result += `\\${char}`;
      } else {
        result += char;
      }
    });
    return result;
  }

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
      pattern += escapeSquareBrackets(specialCharset);
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
      }
      if (uppercase) {
        if (!p.match(/[A-HJ-MPZ]/)) {
          // console.log("fail");
          redo = true;
        }
      }
      if (lowercase) {
        if (!p.match(/[a-kmp-z]/)) {
          redo = true;
        }
      }
      if (specialChars) {
        const pattern = `[${escapeSquareBrackets(specialCharset)}]`;
        const r = new RegExp(pattern, 'g');
        if (!p.match(r)) {
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

  function specialCharacterClick(index) {
    const char = allSpecialChars[index];

    const idx = specialCharset.indexOf(char)
    let x = specialCharset;
    if (idx == -1) {
      x = x + char;
    } else {
      if (specialCharset.length < 2) {
        return
      }
      x = x.slice(0, idx) + x.slice(idx + 1);
    }
    x = x.split("").sort().join('');
    setChanged(true);
    setSpecialCharset(x);
  }
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
            onClick={() => { setChanged(true); setUppercase(!uppercase) }}
          >
            Uppercase
          </CheckBox>

          <CheckBox
            checked={lowercase}
            onClick={() => { setChanged(true); setLowercase(!lowercase) }}
          >
            Lowercase
          </CheckBox>


          <CheckBox
            checked={digits}
            onClick={() => { setChanged(true); setDigits(!digits) }}
          >
            Digits
          </CheckBox>
        </div>


        <div style={{ display: "flex", alignItems: "center", gap: "0 50px", flexWrap: "wrap", }}>

          <CheckBox
            checked={specialChars}
            onClick={() => { setChanged(true); setSpecialChars(!specialChars) }}
          >
            Special characters
          </CheckBox>
        </div>

        {specialChars &&
          (<div>
            <div style={{ fontFamily: "monospace", fontWeight: "bold", margin: "20px 0 10px 0" }}>
              {allSpecialChars.split("").map((char, index) => {
                return (
                  <span key={index} onClick={() => specialCharacterClick(index)} style={{
                    margin: "0 4px",
                    padding: "0 5px",
                    cursor: "pointer",
                    color: (specialCharset.indexOf(char) == -1) ? "var(--body-color)" : "var(--link-color)",
                    fontWeight: (specialCharset.indexOf(char) == -1) ? "normal" : "bold"
                  }}>{char}</span>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              (click to enable/disable a character)
            </div>
          </div>
          )}

        <div onClick={rememberConfig} style={{ display: changed ? "block" : "none", color: "var(--link-color)", cursor: "pointer" }}>Remember my settings</div>


      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Use this password
        </Button>
      </Modal.Footer>

    </Modal>

  );
}

export default GeneratePasswordModal;



/*
  const onSpecialCharsetChange = (e) => {
    setSpecialCharset(e.target.value);
  }
*/

/*}
            <div>
              <input value={specialCharset} onChange={onSpecialCharsetChange}
                style={{
                  border: "none",
                  outline: "none",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  letterSpacing: "0.2em",
                  width: "100%",
                  spellCheck: false,
                }} />
            </div>
*/