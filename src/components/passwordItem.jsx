import React from "react";

import { openInExtension } from "../lib/extensionInterface";
import { lastModified } from "../lib/utils";

/*
function prepareUrl(url) {
  if (url.startsWith("www")) {
    return `<a target='_blank' href='http://${url}' rel="noreferrer noopener">${url}</a>`;
  }
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return `<a target='_blank' href='${url}' rel="noreferrer noopener">${url}</a>`;
  }
  return url;
}
*/

function PasswordItem(props) {

  const showModal = () => {
    props.showModal(props.item);
  };

  const item = props.item;

  const url = item.cleartext[3].split("\x01")[0];
  let link_text = url;
  if (link_text.startsWith("https://")) {
    link_text = link_text.substring(8);
  } else if (link_text.startsWith("http://")) {
    link_text = link_text.substring(7);
  }

  function dragStart(ev) {
    console.log(ev);
    // Change the source element's background color to signify drag has started
    //ev.currentTarget.style.border = "dashed";
    // Add the id of the drag source element to the drag data payload so
    // it is available when the drop event is fired
    ev.dataTransfer.setData("application/json", JSON.stringify(props.item));
    // Tell the browser both copy and move are possible
    ev.effectAllowed = "copyMove";
  }

  // let trClass = props.searchMode ? "search-mode d-flex" : "d-flex";
  let trClass = props.searchMode ? "search-mode" : "";


  return (
    <tr className={trClass} style={{ alignItems: "center" }}>
      <td
        className="item-name-td"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <div
          draggable
          id={`drag${item._id}`}
          onDragStart={dragStart}
          style={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          <svg
            width="24"
            height="24"
            className="itemIcon"
            style={{ cursor: "move" }}
          >
            <use href="#i-key"></use>
          </svg>
          {item.cleartext[0]}
        </div>
        {props.searchMode && (
          <div className="search-path">
            {item.path.map((e) => e[0]).join(" > ")}
          </div>
        )}
      </td>
      <td className="d-none d-xl-table-cell">
        {item.cleartext[1]}
      </td>
      <td
        className="d-none d-md-table-cell login-item-link "
        onClick={() => {
          openInExtension(props.item, url);
        }}
        style={{
          cursor: link_text.length ? "pointer" : "",
        }}
      >
        {link_text}
      </td>
      <td className="d-none d-lg-table-cell column-modified">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default PasswordItem;
