function CheckBox(props) {
    let icon = props.checked ? "#f-checkbox-on" : "#f-checkbox-off-hover";
    return (
      <div
        onClick={props.onClick}
        style={{
          minWidth: "8em",
          cursor: "pointer",
          height: "48px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg width="24" height="24" fill="none">
          <use href={icon}></use>
        </svg>
        {props.children}
      </div>
    );
}

export default CheckBox;
