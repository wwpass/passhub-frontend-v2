import React from "react";

function ItemModalFieldNav(props) {

    let clickAction = null;
    const style27 = props.margin27 ? { marginRight: "27px" } : {};

    if (props.copy) {
      clickAction = (
        <div>
          <span className="iconTitle" style={style27}>
            Copy
          </span>
          <svg width="24" height="24" fill="none" stroke="#1b1b26" title="Copy">
            <use href="#f-copy"></use>
          </svg>
        </div>
      );
    } else if (props.gotowebsite) {
      clickAction = (
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <div className="iconTitle">Go to website</div>
          <div className="gotowebsite"></div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="label">
          <label htmlFor={props.htmlFor}>{props.name}</label>
        </div>
        {clickAction}
      </div>
    );
}

export default ItemModalFieldNav;
