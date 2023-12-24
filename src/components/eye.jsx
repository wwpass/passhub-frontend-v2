import React from "react";

function Eye(props) {
    return (
      <div
        onClick={props.onClick}
        style={{ marginLeft: "15px", paddingLeft: "12px", cursor: "pointer" }}
      >
        <svg
          fill="none"
          style={{ width: 24, height: 24 }}
          onClick={props.onClick}
        >
          {props.hide ? (
            <use href="#eye"></use>
          ) : (
            <use href="#eye-off"></use>
          )}
        </svg>
      </div>
    );
}

export default Eye;
