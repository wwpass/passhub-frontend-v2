import React from "react";
import { lastModified } from "../lib/utils";

function BankCardItem(props) {
  const item = props.item;

  const showModal = () => {
    props.showModal(props.item);
  };

  function dragStart(ev) {
    // Change the source element's background color to signify drag has started
    // ev.currentTarget.style.border = "dashed";
    ev.dataTransfer.setData("application/json", JSON.stringify(item));
    // Tell the browser both copy and move are possible
    ev.effectAllowed = "copyMove";
  }

  const trClass = props.searchMode ? "search-mode d-flex" : "d-flex";
  return (
    <tr className={trClass} style={{ alignItems: "center" }}>
      <td
        draggable
        id={`drag${item._id}`}
        onDragStart={dragStart}
        colSpan="3"
        className="col-md-12 col-lg-8 col-xl-9 item-name-td"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <svg
            width="24"
            height="24"
            className="itemIcon"
            style={{ stroke: "none", cursor: "move", fill: "var(--icon-stroke)" }}
          >
            <use href="#credit_card"></use>
          </svg>
          {item.cleartext[1]}
        </div>
        {props.searchMode && (
          <div className="search-path">
            {item.path.map((e) => e[0]).join(" > ")}
          </div>
        )}
      </td>
      <td className="d-none d-lg-table-cell                 col-lg-4 col-xl-3 column-modified">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default BankCardItem;
