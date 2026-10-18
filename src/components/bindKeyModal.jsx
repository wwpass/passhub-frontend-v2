import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import * as WWPass from 'wwpass-frontend';

import axios from "axios";

import ModalCross from "./modalCross";

import { getApiUrl, getVerifier } from "../lib/utils";
import { reEncryptPrivateKey } from "../lib/crypto";
import progress from "../lib/progress";

const bindKeyRequest = (data) =>
  axios
    .post(`${getApiUrl()}bind_key.php`, { verifier: getVerifier(), ...data })
    .then((reply) => {
      const result = reply.data;
      if (result.status === "login") {
        window.location.href = "expired.php";
      }
      return result;
    });

// callbackURL function gets "?wwp_version=..&wwp_ticket=..&wwp_status=..&wwp_reason=.."
const parseCallback = (url) => {
  const params = new URLSearchParams(url.slice(url.indexOf("?")));
  return {
    ticket: params.get("wwp_ticket"),
    status: params.get("wwp_status"),
    reason: params.get("wwp_reason"),
  };
};

function BindKeyModal(props) {
  const [keys, setKeys] = useState([]);
  const [stage, setStage] = useState("list"); // list | scan | binding
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [scanAttempt, setScanAttempt] = useState(0);
  const qrcodeRef = useRef(null);

  const loadKeys = () => {
    bindKeyRequest({ operation: "list" })
      .then((result) => {
        if (result.status === "Ok") {
          setKeys(result.keys);
          return;
        }
        setErrorMsg(result.status);
      })
      .catch(() => setErrorMsg("Server error. Please try again later"));
  };

  useEffect(() => {
    if (props.show) {
      setStage("list");
      setErrorMsg("");
      setSuccessMsg("");
      loadKeys();
    }
  }, [props.show]);

  const bindKey = (newTicket) => {
    setStage("binding");
    progress.lock();
    bindKeyRequest({ operation: "ticket", ticket: newTicket })
      .then((result) => {
        if (result.status !== "Ok") {
          throw new Error(result.status);
        }
        return reEncryptPrivateKey(result.ePrivateKey, result.currentTicket, result.ticket)
          .catch((err) => {
            console.log(err);
            throw new Error("Cannot encrypt data with the new WWPass key. Please try again");
          });
      })
      .then((ePrivateKey) => bindKeyRequest({ operation: "bind", ePrivateKey }))
      .then((result) => {
        progress.unlock();
        if (result.status !== "Ok") {
          throw new Error(result.status);
        }
        setKeys(result.keys);
        setSuccessMsg("The WWPass key has been bound to your account. Now you can log in with either key.");
        setStage("list");
      })
      .catch((err) => {
        progress.unlock();
        setErrorMsg(err.message);
        setStage("list");
      });
  };

  const authCallback = (url) => {
    const { ticket, status, reason } = parseCallback(url);
    if (status !== "200" || !ticket) {
      setErrorMsg(`WWPass authentication failed: ${reason}`);
      setStage("list");
      return;
    }
    bindKey(ticket);
  };

  useEffect(() => {
    // authInit keeps waiting for a key until the qrcode element is removed from DOM
    if (stage !== "scan" || !qrcodeRef.current) {
      return;
    }
    WWPass.authInit({
      qrcode: qrcodeRef.current,
      ticketURL: `${getApiUrl()}getticket.php`,
      callbackURL: authCallback,
      universal: true,
    }).catch((err) => {
      console.log(err);
    });
  }, [stage, scanAttempt]);

  const onAddKey = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setScanAttempt(scanAttempt + 1);
    setStage("scan");
  };

  const onRemoveKey = (id) => {
    setErrorMsg("");
    setSuccessMsg("");
    progress.lock();
    bindKeyRequest({ operation: "unbind", id })
      .then((result) => {
        progress.unlock();
        if (result.status === "Ok") {
          setKeys(result.keys);
          setSuccessMsg("The WWPass key has been removed from your account");
          return;
        }
        setErrorMsg(result.status);
      })
      .catch(() => {
        progress.unlock();
        setErrorMsg("Server error. Please try again later");
      });
  };

  if (!props.show) {
    return null;
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
        <div className="h2">WWPass keys</div>
      </div>
      <Modal.Body className="edit" style={{ marginBottom: "24px" }}>
        {errorMsg.length > 0 && (
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
        )}
        {successMsg.length > 0 && (
          <div style={{ color: "var(--success-color, #00BC62)", margin: "0 16px 16px" }}>
            {successMsg}
          </div>
        )}

        {stage === "list" && (
          <>
            <div style={{ margin: "0 16px 16px" }}>
              Bind another WWPass key to your account to be able to log in with it,
              e.g. as a backup in case your main key is lost.
            </div>
            {keys.map((key) => (
              <div
                key={key.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "0 16px",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-color, #E7E7EE)",
                }}
              >
                <div>
                  {key.primary ? "Original key" : "Additional key"}
                  {key.current && (
                    <span style={{ color: "#979797", marginLeft: 8 }}>(current session)</span>
                  )}
                  {key.created && (
                    <div style={{ fontSize: "13px", color: "#979797" }}>
                      added {new Date(key.created).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {!key.primary && !key.current && (
                  <a
                    className="link"
                    href="#"
                    style={{ color: "var(--danger-color)" }}
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveKey(key.id);
                    }}
                  >
                    Remove
                  </a>
                )}
              </div>
            ))}
          </>
        )}

        {stage === "scan" && (
          <>
            <div style={{ margin: "0 16px 16px" }}>
              Log in with the WWPass key you want to add: scan the QR code with
              the WWPass Key {/*app or use your hardware WWPass key*/}.
            </div>
            <div
              key={scanAttempt}
              ref={qrcodeRef}
              style={{ width: 256, margin: "32px auto" }}
            ></div>
          </>
        )}

        {stage === "binding" && (
          <div style={{ margin: "32px 16px", textAlign: "center" }}>
            Binding the key...
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {stage === "scan" ? (
          <Button variant="outline-secondary" onClick={() => setStage("list")}>
            Back
          </Button>
        ) : (
          <Button variant="outline-secondary" onClick={props.onClose}>
            Close
          </Button>
        )}
        {stage === "list" && (
          <Button variant="primary" type="button" onClick={onAddKey}>
            Bind another key
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default BindKeyModal;
