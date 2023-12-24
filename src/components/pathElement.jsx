import React from "react";

function PathElement(props) {
    return (
      <React.Fragment>
        <div
          className="path-element"
          onClick={(e) => {
            props.onClick(props.folderid);
          }}
        >
          {props.name}
        </div>
        {props.gt ? " > " : ""}
      </React.Fragment>
    );
}

export default PathElement;
