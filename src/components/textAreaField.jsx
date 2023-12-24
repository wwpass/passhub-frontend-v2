import React from "react";

function TextAreaField(props) {
    return (
      <div
        className="itemModalField"
        style={{ padding: "11px 16px", marginBottom: "16px" }}
      >
        {props.label && props.label.lenght > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ opacity: "0.5" }}>
                <label htmlFor={props.id} style={{ margin: 0 }}>
                  {props.value.length ? props.label : ""}
                </label>
              </span>
            </div>
            <div>{props.children}</div>
          </div>
        )}

        <div>
          <textarea
            id={props.id}
            onChange={props.onChange}
            readOnly={!props.edit}
            spellCheck
            value={props.value}
            placeholder={props.label}
          ></textarea>
        </div>
      </div>
    );
}

export default TextAreaField;
