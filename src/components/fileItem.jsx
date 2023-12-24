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

  return (
    <tr className="d-flex" style={{ alignItems: "center" }}>
      <td
        id={`drag${item._id}`}
        draggable
        onDragStart={dragStart}
        colSpan="2"
        className="col-sm-12 col-md-6 col-lg-4 col-xl-6 item-name-td"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
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
      </td>
      <td className="d-none d-md-table-cell        col-md-6 col-lg-4 col-xl-3 rightAlign">
        {humanReadableFileSize(item.file.size)}
      </td>
      <td className="d-none d-lg-table-cell                 col-lg-4 col-xl-3 column-modified">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default FileItem;
