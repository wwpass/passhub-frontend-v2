import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { capitalizeFirstLetter } from "../lib/utils";
// import { copyBufferTimeout } from "../lib/copyBuffer";

function CopyMoveToast(props) {

  if (!props.show) {
    return null;
  }
  // console.log('rendfering CopyMoveToast');

  const copyBufferTimeout = 40;

  const onClose = () => {
    props.onClose();
  }


  return (
    <Toast
      onClose={props.onClose}
      show={props.show}
      style={{ padding: "16px 8px 8px 16px" }}
    >
      <div className="toast-header">
        <div>
          {capitalizeFirstLetter(props.operation)} item to another safe
        </div>
        {
          <div>
            <svg
              style={{ width: 24, height: 24, cursor: "pointer" }}
              onClick={onClose}
            >
              <use href="#f-cross24"></use>
            </svg>
          </div>
        }
      </div>
      <Toast.Body>
        <div style={{ display: "flex", margin: "16px 0 8px 0" }}>
          {/*
          <div style={{ marginRight: 12 }}>
            <CountdownCircleTimer
              isPlaying
              duration={copyBufferTimeout - 1}
              colors={"#ffffff"}
              trailColor={"rgb(0,188,98"}
              size={48}
              strokeWidth={4}
              onComplete={props.onClose}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>
*/}
          <div>
            Select target safe/folder to copy the item to. Choose
            "Paste" in its menu within 1 minute.
          </div>
        </div>
        {/* 
        <div style={{ height: 60 }}>
          <Button className="btn btn-outline-secondary" style={{ background: "none", margin: "8px 0", float: "right" }} onClick={props.onClose}>
            Cancel
          </Button>
        </div>
*/}
      </Toast.Body>
    </Toast >
  );
}

export default CopyMoveToast;
