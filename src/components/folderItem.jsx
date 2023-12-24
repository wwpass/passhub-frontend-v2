import React from "react";
import { lastModified } from "../lib/utils";

function FolderItem(props) {
  const onClick = () => {
    props.onClick(props.item);
  };

  function dragStart(ev) {
    // Change the source element's background color to signify drag has started
    // ev.currentTarget.style.border = "dashed";
    ev.dataTransfer.setData("application/json", JSON.stringify({ type: "folder", id: props.item.id, SafeID: props.item.SafeID }));
    // Tell the browser both copy and move are possible
    ev.effectAllowed = "move";
  }

  function onDrop(ev) {
    ev.currentTarget.style.background = "none";
    ev.currentTarget.style.border = "none";
    try {
      const itemDropped = JSON.parse(
        ev.dataTransfer.getData("application/json")
      );
      props.dropItem(props.item, itemDropped);
    } catch (e) {
      console.log(e);
    }
  }

  function onDragOver(ev) {
    ev.currentTarget.style.background =
      "linear-gradient(90deg, rgba(0,0,0,0.05),  rgba(0,0,0,0))";
    //ev.currentTarget.style.border = "1px solid lightgreen";
    ev.preventDefault();
  }

  function onDragLeave(ev) {
    ev.currentTarget.style.background = "none";
    ev.currentTarget.style.border = "none";
    ev.preventDefault();
  }

  const angleIcon = (
    <svg
      className="d-sm-none"
      width="32"
      height="32"
      style={{
        fill: "var(--icon-stroke)",
        transform: "rotate(-90deg)",
        float: "right",
      }}
    >
      <use href="#angle"></use>
    </svg>
  );

  return (
    <tr className="d-flex" style={{ alignItems: "center" }}>
      <td
        colSpan="3"
        className="col-md-12 col-lg-8 col-xl-9 item-name-td"
        onClick={onClick}
        draggable
        onDragStart={dragStart}
      >
        <div className="d-none d-sm-block" onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
          <svg width="24" height="24" className="itemIcon" style={{ cursor: "move" }}>
            <use href="#i-folder"></use>
          </svg>
          {props.item.cleartext[0]}
          {angleIcon}
        </div>

        <div className="d-sm-none" onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 8 }}>

          <div>
            <svg width="24" height="24" className="itemIcon" style={{ cursor: "move" }}>
              <use href="#i-folder"></use>
            </svg>
            {props.item.cleartext[0]}
          </div>
          {angleIcon}
        </div>


        {props.searchMode && (
          <div className="search-path">
            {props.item.path.map((e) => e[0]).join(" > ")}
          </div>
        )}

      </td>
      <td className="d-none d-lg-table-cell                 col-lg-4 col-xl-3 column-modified">
        {lastModified(props.item)}
      </td>
    </tr>
  );
}

export default FolderItem;
