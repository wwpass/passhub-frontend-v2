import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

import { saveAs } from "file-saver";

import exportXML from "../lib/exportXML";
import exportCSV from "../lib/exportCSV";
import { getUserData } from "../lib/userData";

function ExportFolderModal(props) {

  if (!props.show) {
    return null;
  }

  const [format, setFormat] = useState("XML");

  const handleFormatChange = (e) => {
    setFormat(e)
  };

  const onClose = () => {
    props.onClose();
  };

  const onSubmit = () => {
    let folder = props.folder ? props.folder : getUserData().safes;
    if (format === "XML") {
      const blob = exportXML(folder);
      saveAs(blob, "passhub.xml");
    } else {
      const blob = exportCSV(folder);
      saveAs(blob, "passhub.csv");
    }
    props.onClose();
  };

  const formatEntries = [
    { format: "XML", comment: "KeePass 2.0 compatible, RECOMMENDED" },
    { format: "CSV", comment: "Readable, Excel compatible" },
  ];

  let title = "Export all safes and folders";

  if (
    props.show &&
    props.folder &&
    !Array.isArray(props.folder)
  ) {
    const folderName =
      props.folder.path[props.folder.path.length - 1][0];
    const isSafe = props.folder.path.length < 2;
    const folderType = isSafe ? "Safe" : "Folder";
    title = `Export ${folderType}: ${folderName}`;
  }

  return (
    <Modal
      show={props.show}
      onHide={onClose}
      animation={false}
      centered
    >
      <ModalCross onClose={props.onClose}></ModalCross>
      <div className="modalTitle">
        <div className="h2">{title}</div>
      </div>
      <Modal.Body>
        <div style={{ marginBottom: 12 }}>
          {formatEntries.map((e) => (
            <div
              key={e.format}
              style={{ display: "flex", marginBottom: 12 }}
              onClick={() => {
                handleFormatChange(e.format);
              }}
            >
              <div>
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  style={{ marginRight: "14px" }}
                >
                  <use
                    href={
                      format === e.format
                        ? "#f-radio-checked"
                        : "#f-radio"
                    }
                  ></use>
                </svg>
              </div>
              <div>
                <div><b>{e.format}</b></div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{e.comment}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", color: "var(--warning-color)" }}>
          <div>
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="var(--warning-color)"
              style={{ marginRight: "14px" }}
            >
              <use href="#no-files-exported"></use>
            </svg>
          </div>
          <div>
            <b>Files and images will not be exported.<br></br> Unfortunately, you
              need to download them manually</b>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={onSubmit}>
          Export
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExportFolderModal;
