import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import Select from 'react-dropdown-select';

import ModalCross from "./modalCross";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import * as passhubCrypto from "../lib/crypto";
// import { getUserData } from "../lib/userData";

function GroupUsersModal(props) {

  if (!props.show) {
    return null;
  }

  const group = props.group;


  //  const [userEmail, setUserEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [values, setValues] = useState([]);

  //  const selection = useRef([]);



  const onClose = () => {
    props.onClose();
  };

  // copypasted to userModal )

  const groupAction = (args) => {
    console.log('group Action: url', args.url, 'args', args.args);
    return axios
      .post(`${getApiUrl()}${args.url}`, args.args)
      .then((response) => {
        const result = response.data;

        if (result.status === "Ok") {
          return "Ok";
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
        return;
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Server error. Please try again later");
      });
  }

  const queryClient = useQueryClient();

  const groupMutation = useMutation({
    mutationFn: groupAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"], exact: true })
    },
  })

  function addUserToGroup(email) {

    return axios
      .post(`${getApiUrl()}group.php`, {
        verifier: getVerifier(),
        operation: "getUserPublicKey",
        groupId: group.GroupID,
        email,
      })
      .then((response) => {
        const result = response.data;

        if (result.status === "Ok") {
          const hexPeerEncryptedAesKey = passhubCrypto.encryptAesKey(
            result.public_key,
            group.bstringKey
          );
          groupMutation.mutate({
            url: 'group.php',
            args: {
              verifier: getVerifier(),
              operation: "addUser",
              groupId: group.GroupID,
              key: hexPeerEncryptedAesKey,
              email
            }
          })
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        setErrorMsg(result.status);
        return;
      })
  }

  const removeUser = (id) => {
    groupMutation.mutate({
      url: 'group.php',
      args: {
        verifier: getVerifier(),
        operation: "removeUser",
        groupId: group.GroupID,
        userId: id
      }
    })
  }

  const onAdd = () => {
    if (values.length > 0) {
      setValues([]);
      addUserToGroup(values[0].label);
    }
  }

  const groupUserIds = group.users.map(u => u.UserID);

  const allUsers = [];

  for (const id in props.userEmailMap) {
    allUsers.push({ value: id, label: props.userEmailMap[id] })
  }
  allUsers.sort((a, b) => a.label.localeCompare(b.label));

  const selectorUsers = [];
  const groupUsers = [];

  for (const user of allUsers) {
    if (!groupUserIds.includes(user.value)) {
      selectorUsers.push({ ...user });
    } else {
      groupUsers.push({ ...user });
    }
  }

  let title = `Group ${group.name} members`;
  let icon = "#f-safe";

  return (
    <Modal
      show={props.show}
      onHide={onClose}
      animation={false}
      centered
    >
      <ModalCross onClose={props.onClose}></ModalCross>

      <div className="modalTitle" style={{ alignItems: "center" }}>
        {/*
        <div>
          <svg width="32" height="32" style={{ marginRight: "14px" }}>
            <use href={icon}></use>
          </svg>
        </div>
  */}

        <div className="h2">{title}</div>
      </div>

      <Modal.Body className="edit">

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ flexGrow: 1 }}>
            <Select
              style={{ height: 48, borderRadius: 12, minWidth: 354 }}
              options={selectorUsers}
              labelField="label"
              values={[...values]}
              onChange={(values) => {
                console.log(values);
                setValues(values);
              }}
              placeholder="Select user to add.."
            />
          </div>

          <Button variant="primary" onClick={onAdd} style={{ marginLeft: "auto" }}>
            Add
          </Button>

        </div>

        <div style={{
          marginTop: "24px",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: 700
        }}>
          Group members
        </div>

        <div style={{ marginLeft: "1em", maxHeight: "calc(100vh - 500px)", overflowY: "auto" }}>
          {groupUsers.map(user => {
            return (
              <div style={{ display: "flex", alignItems: "center", height: "36px", }} >
                <span style={{ cursor: "pointer", padding: "0 0.5em 0 1em" }} onClick={() => removeUser(user.value)} title="remove">
                  <svg
                    style={{
                      strokeWidth: "0",
                      fill: "red",
                      width: "1em",
                      height: "1em",
                    }}
                  >
                    <use href="#cross"></use>
                  </svg>
                </span>
                {user.label}
              </div>)
          })
          }

        </div>

        {errorMsg.length > 0 && (
          <div style={{ color: "red" }}>{errorMsg}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GroupUsersModal;
