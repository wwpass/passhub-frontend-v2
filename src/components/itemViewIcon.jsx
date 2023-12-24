import React from "react";

function ItemViewIcon(props) {
  return (
    <span
      className="itemViewIcon"
      title={props.title}
      onClick={props.onClick}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        style={{
          verticalAlign: "unset",
        }}
      >
        <use href={props.iconId}></use>
      </svg>
    </span>
  );
}

export default ItemViewIcon;
