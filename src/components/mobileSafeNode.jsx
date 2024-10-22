const iconStyle = {
  stroke: "white",
  opacity: "0.7",
  verticalAlign: "middle",
  marginRight: "10px",
};

const sharedFolderIcon = (
  <svg width="24" height="24" style={iconStyle}>
    <use href="#i-folder_shared"></use>
  </svg>
);

const folderIcon = (
  <svg width="24" height="24" style={iconStyle}>
    <use href="#i-folder"></use>
  </svg>
);

function MobileSafeNode(props) {

  const icon = props.node.users > 1 ? sharedFolderIcon : folderIcon;
  const angleIcon = (
    <svg
      width="24"
      height="24"
      style={{
        fill: "white",
        transform: "rotate(-90deg)",
        float: "right",
      }}
    >
      <use href="#angle"></use>
    </svg>
  );

  return (

    <div
      className="folder"
      onClick={() => {
        props.onSelect(props.node);
        document.querySelector("#safe_pane").classList.add("d-none");
        document.querySelector("#table_pane").classList.remove("d-none");
      }}
      style={{
        position: "relative",
        outline: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
      }}
    >
      <span style={{ cursor: "default", textWrap: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
        {icon}
        {props.node.name}
      </span>
      {angleIcon}
    </div>
  );
}

export default MobileSafeNode;
