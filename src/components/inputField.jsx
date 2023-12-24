import React from "react";

function InputField(props) {

  const padding = props.padding ? props.padding : "11px 16px";

  return (
    <div
      className="itemModalField"
      style={{
        padding,

        marginBottom: "16px",
        cursor: props.onClick ? "pointer" : "",
      }}
      onClick={props.onClick}
    >
      {(props.value.length || props.children || !props.edit) &&
        props.label &&
        props.label.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ color: "#1b1b26", opacity: "0.7" }}>
                <label htmlFor={props.id} style={{ margin: 0, color: "var(--item-modal-field-label)" }}>
                  {props.value.length ? props.label : ""}
                </label>
              </span>
            </div>
            <div>{props.children}</div>
          </div>
        )}

      <div>
        <input
          id={props.id}
          onChange={props.onChange}
          onKeyUp={props.onKeyUp}
          readOnly={!props.edit}
          spellCheck={false}
          value={props.value}
          placeholder={props.placeHolder ? props.placeHolder : props.label}
          autoComplete={props.autoComplete ? props.autoComplete : false}
          autoFocus={props.autoFocus}
        ></input>
      </div>
    </div>
  );
}

export default InputField;
