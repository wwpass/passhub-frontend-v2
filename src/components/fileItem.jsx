import React from "react";
import { humanReadableFileSize, lastModified } from "../lib/utils";

function FileItem(props) {
  const showModal = () => {
    props.showModal(props.item);
  };

  const item = props.item;

  function dragStart(ev) {
    // Change the source element's background color to signify drag has started
    // ev.currentTarget.style.border = "dashed";
    ev.dataTransfer.setData("application/json", JSON.stringify(item));
    // Tell the browser both copy and move are possible
    ev.effectAllowed = "copyMove";
  }
  const td1 = (
    <>
      <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        <svg
          width="24"
          height="24"
          className="itemIcon"
          style={{ cursor: "move" }}
        >
          <use href="#i-file"></use>
        </svg>
        {item.cleartext[0]}
      </div>
      {props.searchMode && (
        <div className="search-path">
          {item.path.map((e) => e[0]).join(" > ")}
        </div>
      )}
    </>

  )

  let trClass = props.searchMode ? "search-mode" : "";
  trClass += props.newItem ? "new-item" : "";


  return (
    <tr className={trClass} style={{ alignItems: "center" }}>
      <td
        id={`drag${item._id}`}
        draggable
        onDragStart={dragStart}
        colSpan="2"
        className="d-none d-xl-table-cell item-name-td"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        {td1}
      </td>
      <td
        id={`drag${item._id}`}
        draggable
        onDragStart={dragStart}
        className="d-xl-none item-name-td"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        {td1}
      </td>


      <td className="d-none d-md-table-cell  rightAlign">
        {humanReadableFileSize(item.file.size)}
      </td>
      <td className="d-none d-lg-table-cell  column-modified">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default FileItem;
