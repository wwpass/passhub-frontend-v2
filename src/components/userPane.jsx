import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import { fromArrays } from '../lib/csv';

import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";

import UserTable from './userTable';



export default function UserPane(props) {
    const [searchString, setSearchString] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [email, setEmail] = useState("");

    const queryClient = useQueryClient();

    const newUserAction = () => {
        if (email.trim() == "") {
            return;
        }
        return axios
            .post(`${getApiUrl()}iam.php`, {
                verifier: getVerifier(),
                operation: "newuser",
                email: email.trim(),
            })
            .then((response) => {
                const result = response.data;

                if (result.status === "Ok") {
                    setEmail("");
                    setErrorMsg("");
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

    const newUserMutation = useMutation({
        mutationFn: newUserAction,
        onSuccess: data => {
            queryClient.invalidateQueries(["userList"], { exact: true })
        },
    })


    const onExport = () => {
        let csv = 'email, role, lastSeen\r\n';

        for (let user of props.users) {
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

    const submitEmail = () => {
        newUserMutation.mutate();
    };

    const inputOnFocus = () => {
        setErrorMsg("");
    };

    const inputOnChange = (event) => {
        setEmail(event.target.value);
        setErrorMsg("");
    };

    const inputOnKeyDown = (event) => {
        if (event.key == "Enter") {
            setEmail(event.target.value);
            submitEmail();
        }
    };


    const clearInput = () => {
        setErrorMsg("");
        setEmail("");
    };

    const onSearchChange = (e) => {
        setSearchString(e.target.value);
    }

    const searchClear = () => {
        setSearchString("");
    }

    const inputBackground = searchString.trim().length
        ? "white"
        : "rgba(255, 255, 255, 0.6)";

    const licensed_users = props.licensed ? `/${props.licensed}` : '';

    return (
        <Col
            className="col-xl-9 col-lg-8 col-md-7 col-sm-6 d-none d-sm-block"
            id="user-pane"
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "0 24px"
                }}
            >
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div><b>User management</b></div>
                        <div style={{ display: "flex", gap: 32 }}>
                            <div style={{ cursor: "pointer", color: "var(--link-color)" }}>Audit</div>
                            <div style={{ cursor: "pointer", color: "var(--link-color)" }} onClick={onExport}>Export</div>
                        </div>
                    </div>
                    <div style={{ margin: "16px 0 8px", display: "flex", gap: 16 }}>
                        <input
                            type="email"
                            placeholder="Email"
                            style={{ flexGrow: 1 }}
                            onFocus={inputOnFocus}
                            onChange={inputOnChange}
                            onKeyDown={inputOnKeyDown}
                            value={email}
                        />
                        <Button style={{ margin: 0 }} onClick={submitEmail}>Add User</Button>
                        <span style={{ padding: "12px 16px", borderRadius: 12, background: "#E6E6F04D", color: "#1B1B26", display: "inline-block" }}>
                            Users {props.users.length}{licensed_users}
                        </span>
                    </div>
                    <div id="add-user-error" style={{ height: 16, paddingLeft: 12, lineHeight: "16px", color: "red" }}>{errorMsg}</div>
                    <div style={{ display: "flex", position: "relative", margin: "8px 0 16px 0" }}>
                        <input className="search_string"
                            type="text"
                            autoComplete="off"
                            onChange={onSearchChange}
                            value={searchString}
                            placeholder="Search Users"
                            style={{ padding: "12px 36px 12px 40px", width: "100%" }}
                        />
                        <span className="search_clear" onClick={searchClear} style={{ margin: "12px 0 0 -27px" }}>
                            <svg width="0.7em" height="0.7em" className="item_icon">
                                <use href="#cross"></use>
                            </svg>
                        </span>
                        <span style={{ position: "absolute", left: "12px", top: "10px" }}>
                            <svg
                                width="24"
                                height="24"
                                style={{
                                    opacity: 0.5,
                                }}
                            >
                                <use href="#f-search"></use>
                            </svg>
                        </span>
                    </div>
                </div>
                <UserTable
                    users={props.users}
                    me={props.me}
                    searchString={searchString}
                    showDelDialog={props.showDelDialog}
                >
                </UserTable>
            </div>
        </Col>
    )
}
