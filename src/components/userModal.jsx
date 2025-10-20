import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

import Select from 'react-dropdown-select';

import ModalCross from "./modalCross";

import axios from "axios";
import { getApiUrl, getFolderById, getVerifier } from "../lib/utils";

import * as passhubCrypto from "../lib/crypto";

function UserModal(props) {

    if (!props.show) {
        return null;
    }
    const [errorMsg, setErrorMsg] = useState("");
    const [values, setValues] = useState([]);

    const onClose = () => {
        props.onClose();
    };

    const queryClient = useQueryClient();

    // copypasted from userRecord

    const changeRoleAction = (newRole) => {

        axios
            .post(`${getApiUrl()}iam.php`, {
                verifier: getVerifier(),
                operation: newRole,
                id: props.user._id,
                email: props.user.email,
            })
            .then((result) => {
                console.log('changeRole result', result)
                if (result.data.status === "Ok") {
                    queryClient.invalidateQueries({ queryKey: ["userList"], exact: true });
                    return "Ok";
                }
                if (result.data.status === "login") {
                    window.location.href = "expired.php";
                    return;
                }
                self.setState({ errorMsg: result.data.status });
            })
            .catch((error) => {
                setErrorMsg("Server error. Please try again later");
            });
    };

    const changeRoleMutation = useMutation({
        mutationFn: changeRoleAction,
        onSuccess: data => {
            //            queryClient.invalidateQueries(["userList"], { exact: true });
        },
    })

    const changeRole = (newRole, oldRole) => {
        if (newRole !== oldRole) {
            changeRoleMutation.mutate(newRole);
        }
    };

    // copypasted from groupUserModal

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

    const groupMutation = useMutation({
        mutationFn: groupAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userList"], exact: true })
        },
    })

    const groupIndex = {}

    for (const group of props.groups) {
        groupIndex[group.GroupID] = group;
    }

    function addUserToGroup(groupId, email) {

        return axios
            .post(`${getApiUrl()}group.php`, {
                verifier: getVerifier(),
                operation: "getUserPublicKey",
                groupId,
                email,
            })
            .then((response) => {
                const result = response.data;

                if (result.status === "Ok") {
                    const hexPeerEncryptedAesKey = passhubCrypto.encryptAesKey(
                        result.public_key,
                        groupIndex[groupId].bstringKey
                    );
                    groupMutation.mutate({
                        url: 'group.php',
                        args: {
                            verifier: getVerifier(),
                            operation: "addUser",
                            groupId,
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

    const removeUser = (groupId, userId) => {
        groupMutation.mutate({
            url: 'group.php',
            args: {
                verifier: getVerifier(),
                operation: "removeUser",
                groupId,
                userId,
            }
        })
    }

    const onAdd = () => {
        if (values.length > 0) {
            setValues([]);
            addUserToGroup(values[0].value, props.user.email);
        }
    }

    const selectorGroups = [];
    const userGroups = [];

    for (const group of props.groups) {
        let isGroupMember = false;
        for (const user of group.users) {
            if (user.UserID == props.user._id) {
                isGroupMember = true;
                userGroups.push({ value: group.GroupID, label: group.name });
                continue;
            }
        }
        if (!isGroupMember) {
            selectorGroups.push({ value: group.GroupID, label: group.name });
        }
    }

    selectorGroups.sort((a, b) => a.label.localeCompare(b.label));
    userGroups.sort((a, b) => a.label.localeCompare(b.label));


    let role = "active";
    if (props.user.disabled) {
        role = "disabled";
    } else if (props.user.site_admin) {
        role = "admin";
    } else if (!props.user._id) {
        role = "invited";
    }

    return (
        <Modal
            show={props.show}
            onHide={onClose}
            animation={false}
            centered
        >
            <ModalCross onClose={onClose}></ModalCross>

            <div className="modalTitle" style={{ alignItems: "center" }}>

                <div className="h2">{props.user.email}</div>
            </div>

            <Modal.Body className="edit">
                <div style={{ display: "flex", alignItems: "center", maxWidth: 354, justifyContent: "space-between" }}>
                    {props.LDAP ? (<div>Status: <span style={{ fontWeight: "bold", marginLeft: "0.3em" }}>{role}</span></div>) :

                        props.user.status == "invited" ? (<div>Status: <span style={{ fontWeight: "bold", marginLeft: "0.3em" }}>invited</span></div>) : (
                            <>
                                <div>Status</div>
                                <div>
                                    <Dropdown
                                        onSelect={(newRole) => {
                                            changeRole(newRole, role);
                                        }}
                                        style={{ float: "right" }}
                                    >
                                        <Dropdown.Toggle
                                            variant="secondary"
                                            style={{
                                                background: "transparent",
                                                color: "var(--body-color)",
                                                border: "none",
                                                boxShadow: "none",
                                                margin: 0,
                                            }}
                                        >
                                            {role}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="left">
                                            <Dropdown.Item eventKey="active">active</Dropdown.Item>
                                            <Dropdown.Item eventKey="disabled">disabled</Dropdown.Item>
                                            <Dropdown.Item eventKey="admin">admin</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </>
                        )}

                    {((props.user.status !== "invited") || !props.LDAP) && (<a href="#" onClick={() => props.onClose(props.user)} style={{ color: "var(--danger-color)" }}>Delete account</a>)}
                </div>

                {(props.user.status != "invited") && (
                    <>
                        <div style={{
                            marginTop: "24px",
                            marginBottom: "16px",
                            fontSize: "18px",
                            fontWeight: 700
                        }}>
                            Groups
                        </div>

                        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 24, marginBottom: 16 }}>
                            <div style={{ flexGrow: 1 }}>
                                <Select
                                    style={{ height: 48, borderRadius: 12, minWidth: 354 }}
                                    options={selectorGroups}
                                    labelField="label"
                                    values={[...values]}
                                    onChange={(values) => {
                                        console.log(values);
                                        setValues(values);
                                    }}
                                    placeholder="Select group to add.."
                                />
                            </div>

                            <Button variant="primary" onClick={onAdd} style={{ marginLeft: "auto" }}>
                                Add group
                            </Button>

                        </div>

                        <div style={{ marginLeft: "1em", maxHeight: "calc(100vh - 500px)", overflowY: "auto" }}>
                            {userGroups.map(group => {
                                return (
                                    <div style={{ display: "flex", alignItems: "center", height: "36px", }} >
                                        <span style={{ cursor: "pointer", padding: "0 0.5em 0 1em" }}
                                            onClick={() => {
                                                removeUser(group.value, props.user._id)
                                            }
                                            }
                                            title="remove"
                                        >
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
                                        {group.label}
                                    </div>)
                            })
                            }

                        </div>
                    </>
                )}

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

export default UserModal;
