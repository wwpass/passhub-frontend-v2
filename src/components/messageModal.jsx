import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function MessageModal(props) {

    let iconId = "#f-success";
    let iconStyle = { width: "112px", height: "112px" };
    let title = "Success";
    if (props.error) {
      iconId = "#a-error";
      title = "Error";
    } else if (props.norights) {
      iconId = "#a-forbidden";
      iconStyle.fill = "red";
      iconStyle.margin = "1em";
      title = "Forbidden";
    } else if (props.thankyou) {
      title = "Thank you";
    } else {
      iconStyle.fill = "none";
    }

    return (
      <Modal
        show={props.show}
        onHide={props.onClose}
        animation={false}
        centered
      >
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <svg style={iconStyle}>
              <use href={iconId}></use>
            </svg>
            <div className="h2" style={{ marginBottom: "1em" }}>
              {title}
            </div>
            <div style={{ marginBottom: "108px" }}>{props.children}</div>
            <Button
              variant="primary"
              type="submit"
              style={{ minWidth: "168px", marginLeft: "12px" }}
              onClick={props.onClose}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
}

export default MessageModal;
