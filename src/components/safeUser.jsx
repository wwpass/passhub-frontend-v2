import React from "react";

import {
  contextMenu,
  Menu,
  Item,
  Separator,
  Submenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

function SafeUser(props) {

  const handleRoleMenuClick = (cmd, user) => {
    let role = "readonly";
    if (cmd == "Limited view") {
      role = "limited view";
    }
    if (cmd == "Can edit") {
      role = "editor";
    }
    if (cmd == "Safe owner") {
      role = "administrator";
    }
    if (cmd == "Remove") {
      role = "Remove";
    }
    console.log(cmd.user);
    props.setUserRole(user.name, role);
  };

  const safeUserMenu = (
    <Menu id={"safe-user-menu"}>

      <Item
        onClick={(e) => {
          handleRoleMenuClick("Safe owner", e.props.user);
        }}
      >
        <div>
          <div>Safe owner</div>
          <div className="safe-user-menu-details">
            Additionaly can share safe and manage user access rights
          </div>
        </div>
      </Item>

      <Item
        onClick={(e) => {
          console.log(e);
          handleRoleMenuClick("Can edit", e.props.user);
        }}
      >
        <div>
          <div>Can Edit</div>
          <div className="safe-user-menu-details">
            User can edit, delete, and add files to the Safe
          </div>
        </div>
      </Item>

      <Item
        onClick={(e) => {
          handleRoleMenuClick("Can view", e.props.user);
        }}
      >
        <div>
          <div>Can view</div>
          <div className="safe-user-menu-details">
            User can only view records and download files
          </div>
        </div>
      </Item>

      <Item
        onClick={(e) => {
          handleRoleMenuClick("Limited view", e.props.user);
        }}
        hidden={!props.hiddenPasswordEnabled}
      >
        <div>
          <div>Limited view</div>
          <div className="safe-user-menu-details">
            User can only view records and download files, passwords are hidden
          </div>
        </div>
      </Item>

      <Item onClick={(e) => handleRoleMenuClick("Remove", e.props.user)}>
        <div style={{ color: "#B40020", fontWeight: "bold" }}>
          Revoke access
        </div>
      </Item>
    </Menu>
  );

  const showSafeUserMenu = (e) => {
    contextMenu.show({
      id: "safe-user-menu",
      event: e,
      props: { user: props.user },
    });
  };

  /////////////////////render() {

  let role = "can view";

  if (props.user.role == "limited view") {
    role = "limited view";
  }

  if (props.user.role == "editor") {
    role = "can edit";
  }
  if (props.user.role == "administrator") {
    role = "owner";
  }
  return props.user.myself ? (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          color: "var(--body-color70)",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        <b>Me&nbsp;&#183;</b>&nbsp;
        {props.user.name}
      </div>
      <div
        style={{
          marginRight: "1em",
          textAlign: "end",
          width: "7em",
        }}
      >
        {role}
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}
    >
      <div style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
        {props.user.name}
      </div>
      {safeUserMenu}
      {props.isAdmin ? (
        <div className="roleChanger" onClick={showSafeUserMenu}>
          {role}

          <svg
            width="24"
            height="24"
            style={{
              verticalAlign: "top",
              fill: "#009A50",
            }}
          >
            <use href="#angle"></use>
          </svg>
        </div>
      ) : (
        <div>{role}</div>
      )}
    </div>
  );
}

export default SafeUser;
