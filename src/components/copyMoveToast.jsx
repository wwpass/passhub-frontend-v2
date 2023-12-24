import Toast from "react-bootstrap/Toast";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { capitalizeFirstLetter } from "../lib/utils";
// import { copyBufferTimeout } from "../lib/copyBuffer";

function CopyMoveToast(props) {
 
    if(!props.show) {
      return null;
    }
    // console.log('rendfering CopyMoveToast');

    const copyBufferTimeout = 40;

    return (
      <Toast
        onClose={props.onClose}
        show={props.show}
        className="go-premium-toast toast-ph"
      >
        <div className="toast-header">
          <div>
            {capitalizeFirstLetter(props.operation)} item to another safe
          </div>
          <div>
            <svg
              style={{ width: 24, height: 24, cursor: "pointer" }}
              onClick={props.onClose}
            >
              <use href="#f-cross24"></use>
            </svg>
          </div>
        </div>
        <Toast.Body>
          <div style={{ display: "flex" }}>
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
            <div>
              Select target safe/folder to copy the item to.<br></br> Choose
              "Paste" in its menu.
            </div>
          </div>
        </Toast.Body>
      </Toast>
    );
}

export default CopyMoveToast;
