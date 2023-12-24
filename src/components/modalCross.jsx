import React from "react";

function ModalCross(props) {
  return (
    <React.Fragment>
      <span className="modal-cross d-md-none" onClick={props.onClose}>
        &#215;
      </span>

      <div className="modal-cross d-none d-md-block" onClick={props.onClose}>
        <svg width="32" height="32">
          <use href="#f-cross"></use>
        </svg>
      </div>
    </React.Fragment>
  );
}

export default ModalCross;
