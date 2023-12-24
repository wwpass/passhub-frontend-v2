import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

function DeleteAccountModal(props) {
    return (
      <Modal
        show={props.show}
        onHide={props.onClose}
        animation={false}
        centered
      >
        <ModalCross onClose={props.onClose}></ModalCross>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "48px 0 0 0",
          }}
        >
          <svg style={{ width: 80, height: 80, fill: "red" }}>
            <use href="#a-danger"></use>
          </svg>
          <div style={{ margin: "24px 0 32px 0", fontSize: "32px" }}>
            Before shutting down your account
          </div>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <b>Be sure</b> to transfer ownership of your shared safes to your
          peers.
        </div>
        <div style={{ marginBottom: "48px" }}>
          <b>Please note</b> it is the last chance to backup (export) all your
          data.
        </div>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => props.onClose("dummy", "delete account final")}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default DeleteAccountModal;
