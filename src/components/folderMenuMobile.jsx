import React from "react";
import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
/// import { isCopyBufferEmpty } from "../lib/copyBuffer";
import { isPasteEnabled } from "../lib/utils";

const SAFE_MENU_MOBILE_ID = "safe-menu-mobile_id";
const FOLDER_MENU_MOBILE_ID = "folder-menu-mobile_id";

function FolderMenuMobile(props) {

  const handleItemClick = (cmd) => {
    props.onMenuCmd(props.node, cmd);
    console.log(cmd);
  };

  const folderMenu = (
    <Menu id={FOLDER_MENU_MOBILE_ID}>
      <Item
        onClick={() => {
          handleItemClick("rename");
        }}
      >
        Rename
      </Item>
      <Item
        onClick={() => {
          handleItemClick("Add folder");
        }}
      >
        Add folder
      </Item>
      <Item
        disabled={!isPasteEnabled()}
        onClick={() => {
          handleItemClick("Paste");
        }}
      >
        Paste
      </Item>
      <Item
        onClick={() => {
          handleItemClick("export");
        }}
      >
        Export
      </Item>
      <Item
        onClick={() => {
          handleItemClick("delete");
        }}
      >
        Delete
      </Item>
    </Menu>
  );

  const safeMenu = (
    <Menu id={SAFE_MENU_MOBILE_ID}>
      <Item
        onClick={() => {
          handleItemClick("Share");
        }}
      >
        Share
      </Item>
      <Item
        onClick={() => {
          handleItemClick("rename");
        }}
      >
        Rename
      </Item>
      <Item
        onClick={() => {
          handleItemClick("Add folder");
        }}
      >
        Add folder
      </Item>

      <Item
        disabled={!isPasteEnabled()}
        onClick={() => {
          handleItemClick("Paste");
        }}
      >
        Paste
      </Item>
      <Item
        onClick={() => {
          handleItemClick("export");
        }}
      >
        Export
      </Item>
      <Item
        onClick={() => {
          handleItemClick("delete");
        }}
      >
        Delete
      </Item>
    </Menu>
  );

  const showSafeMenu = (e) => {
    e.preventDefault();
    contextMenu.show({ id: SAFE_MENU_MOBILE_ID, event: e });
  };

  const showFolderMenu = (e) => {
    e.preventDefault();
    contextMenu.show({ id: FOLDER_MENU_MOBILE_ID, event: e });
  };

  //////////////// 

  const menu = props.isSafe ? safeMenu : folderMenu;
  const style = props.color ? { stroke: props.color } : {};

  return (
    <>
      <div
        className="menu-dots"
        onClick={props.isSafe ? showSafeMenu : showFolderMenu}
      >
        <svg width="24" height="24" className="safe_pane_icon" style={{ stroke: "var(--icon-stroke)" }}>
          <use href="#el-dots"></use>
        </svg>
      </div>
      {menu}
    </>
  );
}

export default FolderMenuMobile;
