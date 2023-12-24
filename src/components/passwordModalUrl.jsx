// import React from "react";
import ItemModalFieldNav from "./itemModalFieldNav";
import { openInExtension } from "../lib/extensionInterface";
import { copyToClipboard, startCopiedTimer } from "../lib/copyToClipboard";

function PasswordModalUrl(props) {

  function followUrl() {
    if (!props.edit && props.url && props.url.length > 0) {
      openInExtension(props.item, props.url);
    }
  }

  function followSecondaryUrl() {
    if (!props.edit && props.secondaryUrl && props.secondaryUrl.length > 0) {
      openInExtension(props.item, props.secondaryUrl);
    }
  }

  const showSecondaryUrl = props.showSecondaryUrl && ((props.secondaryUrl != "") || props.edit)

  return (
    <>
      <div
        className={showSecondaryUrl ? "itemModalField upper" : "itemModalField"}
        style={{ display: "flex", position: "relative", marginBottom: showSecondaryUrl ? 0 : 32 }}
      >
        <div
          style={{ flexGrow: 1, overflow: "hidden" }}
          onClick={followUrl}
        >
          <ItemModalFieldNav
            gotowebsite={!props.edit && props.url.length > 0}
            name="Website Address"
            htmlFor="websiteaddress"
          />
          {props.edit ? (
            <div>
              <input
                id="websiteaddress"
                onChange={props.onUrlChange}
                spellCheck={false}
                value={props.url}
              ></input>
            </div>
          ) : (
            <div
              className="url-span"
              style={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {props.url}
            </div>
          )}

          <div className="copied" id="url_copied">
            <div style={{ margin: "0 auto", color: "var(--link-color)" }}>Copied &#10003;</div>
          </div>
        </div>

        {!props.edit && props.url.length > 0 && (
          <div
            style={{
              display: "flex",
              cursor: "pointer",
              justifyContent: "center",
              marginLeft: "12px",
              paddingLeft: "12px",
            }}
            title="Copy URL"
            onClick={() => {
              if (!props.edit) {
                copyToClipboard(props.url);
                document.querySelector("#url_copied").style.display = "flex";
                startCopiedTimer();
              }
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#1b1b26"
              title="Copy"
            >
              <use href="#f-copy"></use>
            </svg>
          </div>
        )}
      </div>
      {showSecondaryUrl && (
        <div
          className="itemModalField lower"
          style={{ display: "flex", position: "relative", marginBottom: 32 }}
          onClick={followSecondaryUrl}
        >
          <div style={{ flexGrow: 1, overflow: "hidden" }}>
            <ItemModalFieldNav
              name="Secondary URL"
              htmlFor="secondary-url"
            />
            {props.edit ? (
              <div>
                <input
                  id="secondary-url"
                  spellCheck={false}
                  value={props.secondaryUrl}
                  onChange={props.onSecondaryUrlChange}
                ></input>
              </div>
            ) : (
              <div
                className="url-span"
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {props.secondaryUrl}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default PasswordModalUrl;