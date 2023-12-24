import React from "react";

function DownloadAndViewButtons(props) {
  return (
    <React.Fragment>
      {props.view && (
        <div
          className="download-and-view view-only d-sm-none"
          style={{ marginBottom: "8px", width: "100%" }}
        >
          <button className="btn-as-span" onClick={props.onView}>
            <svg width="24" height="26">
              <use href="#f-eye-grey"></use>
            </svg>
            View
          </button>
        </div>
      )}

      <div
        className="download-and-view view-only d-sm-none"
        style={{ marginBottom: "40px", width: "100%" }}
      >
        <button className="btn-as-span" onClick={props.onDownload}>
          <svg width="24" height="24" stroke="var(--icon-stroke)">
            <use href="#f-simple-download"></use>
          </svg>
          Download
        </button>
      </div>
      <div
        className="download-and-view view-only d-none d-sm-block"
        style={{ marginBottom: "74px" }}
      >
        {props.view && (
          <button
            className="btn-as-span"
            onClick={props.onView}
            style={{ borderRight: "1px solid var(--download-and-view-border)" }}
          >
            <svg width="24" height="26">
              <use href="#f-eye-grey"></use>
            </svg>
            View
          </button>
        )}
        <button className="btn-as-span" onClick={props.onDownload}>
          <svg width="24" height="24" stroke="var(--icon-stroke)">
            <use href="#f-simple-download"></use>
          </svg>
          Download
        </button>
      </div>
    </React.Fragment>
  );
}

export default DownloadAndViewButtons;
