import React, { useState, useEffect, useRef } from "react";


import { QueryClient, useQuery } from '@tanstack/react-query';

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import DelUserModal from "./delUserModal";

import GroupUsersModal from "./groupUsersModal";
import GroupDeleteModal from "./groupDeleteModal";
import GroupNameModal from "./groupNameModal";
import GroupSafesModal from "./groupSafesModal";

import { decryptGroups } from "../lib/userData";


// import "react-contexify/dist/ReactContexify.css";

import UserPane from "./userPane";
import GroupPane from "./groupPane";


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

export default function UserManagementPage(props) {

  const queryClient = new QueryClient();

  if (!props.show) {
    return null;
  }

  const currentGroupRef = useRef(null);

  const [showModal, setShowModal] = useState("");
  //  const [groupModalArgs, setGroupModalArgs] = useState({});
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

  const showDelDialog = (data) => {
    setDelDialogData({ email: data.email, id: data.id, show: true });
  };


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

  return (
    <>
      <UserPane
        users={users}
        licensed={licensedUsers}
        me={me}
        showDelDialog={showDelDialog}
      >

      </UserPane>
      <GroupPane
        groups={groups}
        onAddGroup={() => setShowModal("GroupCreateModal")}
        handleGroupMenuClick={handleGroupMenuClick}
      >

      </GroupPane>
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
    </>
  );
}
