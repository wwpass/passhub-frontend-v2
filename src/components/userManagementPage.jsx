import React, { useState, useEffect, useRef } from "react";
import { QueryClient, useQuery } from '@tanstack/react-query';

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import { fromArrays } from '../lib/csv';
import { saveAs } from "file-saver";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import InviteDiv from "./inviteDiv";
import UserTable from "./userTable";
import DelUserModal from "./delUserModal";
import GroupNameModal from "./groupNameModal";

import GroupSafesModal from "./groupSafesModal";
import GroupUsersModal from "./groupUsersModal";
import GroupDeleteModal from "./groupDeleteModal";

import Group from "./group";

// import * as passhubCrypto from "../lib/crypto";
import { decryptGroups } from "../lib/userData";



import table_row from '../assets/table-row.svg';


import {
  contextMenu,
  Menu,
  Item,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

/*
function cmp(o1, o2) {
  const u1 = o1.email.toUpperCase();
  const u2 = o2.email.toUpperCase();
  if (u1 < u2) {
    return -1;
  }
  if (u1 > u2) {
    return 1;
  }
  return 0;
}
*/


function downloadUserList() {
  return axios
    .post(`${getApiUrl()}iam.php`, {
      verifier: getVerifier(),
      operation: "users",
    });
}

function userListQuery() {
  console.log("userList query called");

  return downloadUserList()
    .then(result => {

      if (result.data.status === "Ok") {
        return decryptGroups(result.data.groups)
          .then((xx) => {  // Indeed, Promise.all returns array of every promise results. Cool
            return result.data
          })
      }
      if (result.data.status === "login") {
        window.location.href = "expired.php";
        return;
      }
      setErrorMsg(result.data.status);
    })
    .catch((error) => {
      console.log(error);
    });
};

function UserManagementPage(props) {

  const queryClient = new QueryClient();

  if (!props.show) {
    return null;
  }

  const currentGroupRef = useRef(null);

  const [showModal, setShowModal] = useState("");
  const [groupModalArgs, setGroupModalArgs] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [searchString, setSearchString] = useState("");
  const [delDialogData, setDelDialogData] = useState({ email: "", id: "", show: false });

  const { data: datax, isLoading } = useQuery({
    queryKey: ["userList"],
    queryFn: () => userListQuery().then(data => {
      return data;
    }),
  });

  if (isLoading) {
    console.log('isLoading');
    return null;
  }

  const { me, users, groups, LICENSED_USERS: licensedUsers } = datax;

  const userEmail = {}

  for (const user of users) {
    if ("_id" in user) {
      userEmail[user._id] = user.email;
    }
  }

  const onSearchChange = (e) => {
    setSearchString(e.target.value);
  }

  const searchClear = () => {
    setSearchString("");
  }

  const onExport = () => {
    let csv = 'email, role, lastSeen\r\n';

    for (let user of users) {
      let status = user.status;
      if (user.disabled) {
        status = "disabled";
      }

      if (!status) {
        status = user.site_admin ? "admin" : "active";
      }
      csv += fromArrays([[user.email, status, user.lastSeen]])
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, "passhub-users.csv");
  }

  const showDelDialog = (data) => {
    setDelDialogData({ email: data.email, id: data.id, show: true });
  };


  //--- group menu ---

  const handleGroupMenuClick = (cmd, group) => {
    currentGroupRef.current = group;
    if (cmd == "Users") {
      setShowModal("GroupUsersModal");
      return;
    }
    if (cmd == "Safes") {
      setShowModal("GroupSafesModal");
      return;
    }
    if (cmd == "Rename") {
      setShowModal("GroupNameModal");
      return;
    }
    if (cmd == "Delete") {
      setShowModal("GroupDeleteModal");
      return;
    }
  }

  if ((showModal != "") && (showModal != "GroupCreateModal")) {

    for (const group of groups) {
      if (group.GroupID === currentGroupRef.current.GroupID) {
        if (group != currentGroupRef.current) {
          console.log('updateGroupRef');
          currentGroupRef.current = group;
        }
        break;
      }
    }
  }

  const menuItemNames = ["Users", "Safes", "Rename", "Delete"];

  const groupMenu = (
    <Menu id={"group-menu"}>

      {menuItemNames.map((itemName) => (
        <Item onClick={(e) => {
          handleGroupMenuClick(itemName, e.props.group);
        }}
        >
          {itemName}
        </Item>
      ))}
    </Menu>
  );

  //--- group menu ---


  const inputBackground = searchString.trim().length
    ? "white"
    : "rgba(255, 255, 255, 0.6)";

  let licensed = licensedUsers ? <><br></br><span> licensed users: {licensedUsers}</span></> : null;
  let userCountSpan = <span>users: {users.length}</span>;

  return (

    <Card className="col user-management-card">
      <Card.Header
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h1>User Management</h1>

        <button
          type="button"
          className="close"
          style={{ fontSize: "inherit", border: "none", background: "transparent" }}
          aria-label="Close"
          onClick={props.gotoMain}
        >
          <svg width="18" height="18" stroke="var(--body-color)">
            <use href="#el-x"></use>
          </svg>
        </button>

      </Card.Header>
      <Card.Body style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {errorMsg.length > 0 ? (
          <div style={{ fontSize: "32px", color: "red" }}>
            {errorMsg}
          </div>
        ) : (

          <div style={{ display: "flex", gap: 25, height: "100%" }}>

            <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "66%" }}>
              <InviteDiv
                users={users}
                licensedUsers={licensedUsers}
              />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 16px 16px 0", alignItems: "center", background: "#eee" }}>
                <div
                  style={{
                    padding: "0 36px 0 16px",
                    position: "relative",
                    flexGrow: 1
                  }}
                >
                  <input
                    className="search_string"
                    type="text"
                    placeholder="Search.."
                    autoComplete="off"
                    onChange={onSearchChange}
                    value={searchString}
                    style={{
                      width: "100%",
                      background: inputBackground,
                      backdropFilter: "blur(40px)",
                      border: "#bbb 1px solid"
                    }}
                  />

                  <span className="search_clear" onClick={searchClear}>
                    <svg width="0.7em" height="0.7em" className="item_icon">
                      <use href="#cross"></use>
                    </svg>
                  </span>
                  <span style={{ position: "absolute", left: "28px", top: "10px" }}>
                    <svg
                      width="24"
                      height="24"
                      style={{
                        opacity: 0.4,
                      }}
                    >
                      <use href="#f-search"></use>
                    </svg>
                  </span>
                </div>
                <div style={{ background: "#f8f8f8", padding: "0 12px", borderRadius: 12 }}>
                  {userCountSpan}
                  {licensed}
                </div>

                <Button
                  className="btn btn-sm btn-primary"
                  style={{ verticalAlign: "top", marginLeft: "2em" }}
                  onClick={onExport}
                >
                  Export
                </Button>
              </div>

              <UserTable
                users={users}
                me={me}
                showDelDialog={showDelDialog}
                searchString={searchString.toLowerCase()}
              />
            </div>

            <div className="groups-pane">
              <div style={{ background: "#eee", padding: "16px", height: "190px", flexShrink: 0, position: "relative" }}>
                <h2>User Groups</h2>
                <div>
                  <Button
                    className="btn btn-sm btn-primary"
                    style={{ position: "absolute", right: 16, bottom: 16 }}
                    onClick={() => {
                      setShowModal("GroupCreateModal")
                    }}>
                    Add group
                  </Button>
                </div>
              </div>
              <div className="table-pane-scroll-control custom-scroll" style={{ overflowY: "auto", flexGrow: 1, /*background: `url(${table_row})`*/ }}>
                {groups && groups.map((group) => (
                  <Group
                    group={group}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Card.Body>
      <>
        {groupMenu}
      </>
      <GroupUsersModal
        show={showModal == "GroupUsersModal"}
        group={currentGroupRef.current}
        userEmailMap={userEmail}
        onClose={() => {
          setShowModal("");
        }}
      />
      <GroupSafesModal
        show={showModal == "GroupSafesModal"}
        group={currentGroupRef.current}
        onClose={() => {
          setShowModal("");
        }}
      />
      <GroupNameModal
        show={showModal == "GroupCreateModal"}
        groups={groups}
        onClose={() => {
          setShowModal("");
        }}
      />
      <GroupNameModal
        show={showModal == "GroupNameModal"}
        group={currentGroupRef.current}
        groups={groups}
        onClose={() => {
          setShowModal("");
        }}
      />

      <GroupDeleteModal
        show={showModal == "GroupDeleteModal"}
        group={currentGroupRef.current}
        onClose={() => {
          setShowModal("");
        }}
      />
      <DelUserModal
        data={delDialogData}
        onClose={() => {
          setDelDialogData({ email: "", id: "", show: false });
        }}
      />

    </Card>
  );
}

export default UserManagementPage;
