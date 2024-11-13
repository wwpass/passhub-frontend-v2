import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from 'react-dropdown-select';

import ModalCross from "./modalCross";

import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

function downloadAudit() {
    return axios
        .post(`${getApiUrl()}iam.php`, {
            verifier: getVerifier(),
            operation: "audit",
        });
}

const x = new Date();
const tzo = x.getTimezoneOffset();

function auditQuery() {
    console.log("audit called");

    return downloadAudit()
        .then(responce => {
            const result = responce.data;
            if (result.status === "Ok") {
                return result;
            }
            if (result.status === "login") {
                window.location.href = "/";
                return;
            }
            //        setErrorMsg(result.data.status);
        })
        .catch((error) => {
            console.log(error);
        });
};


function AuditModal(props) {
    if (!props.show) {
        return null;
    }

    const [errorMsg, setErrorMsg] = useState("");
    const [firstDate, setFirstDate] = useState();
    const [lastDate, setLastDate] = useState();
    const [userFilter, setUserFilter] = useState("--All--");
    const [eventFilter, setEventFilter] = useState("--All--");
    const [reverseSort, setReverseSort] = useState(false);


    const queryClient = useQueryClient();

    const onClose = () => {
        props.onClose();
    };

    const { data: response, isPending } = useQuery({
        queryKey: ["audit"],
        queryFn: () => auditQuery().then(data => {
            return data;
        }),
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["audit"], exact: true })
    }

    if (isPending) {
        console.log('isPending');
        return null;
    }



    console.log('response');
    console.log(response);

    const auditRecords = JSON.parse(response.data);

    console.log('auditRecords');
    console.log(auditRecords);

    const userSet = new Set();
    for (const record of auditRecords) {
        userSet.add(record.actor);
    }
    let userArray = Array.from(userSet);
    userArray = userArray.map(a => a ? a : "");
    userArray.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    console.log(userArray);

    const allUsers = [{ value: '--All--', label: '--All--' }];
    for (const u of userArray) {
        allUsers.push({ value: u, label: u })
    }

    const eventSet = new Set();
    for (const record of auditRecords) {
        eventSet.add(record.operation);
    }

    let eventArray = Array.from(eventSet);
    eventArray = eventArray.map(a => a ? a : "");
    eventArray.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    console.log(eventArray);

    const allEvents = [{ value: '--All--', label: '--All--' }];
    for (const e of eventArray) {
        allEvents.push({ value: e, label: e })
    }

    /*
    function elogInput(e) {
        let value = e.target.value;
        console.log('onInput ', value);
    
        const x = new Date(value);
        const t = new Date(x.getTime() + tzo * 1000 * 60);
        console.log(t);
    
        const u = t.toISOString();
        console.log(u);
    }
    */

    function elogChange(e) {
        let value = e.target.value;
        console.log('onChange ', value);

        const x = new Date(value);
        const t = new Date(x.getTime() + tzo * 1000 * 60);
        const u = t.toISOString();
        console.log(u);
    }

    function onFirstDate(e) {
        let value = e.target.value;
        console.log('onInput ', value);

        const x = new Date(value);
        const t = new Date(x.getTime() + tzo * 1000 * 60);
        console.log(t);

        const u = t.toISOString();
        setFirstDate(u);
        console.log(u);
    }


    function onLastDate(e) {
        let value = e.target.value;
        console.log('onInput ', value);

        const x = new Date(value);
        const t = new Date(x.getTime() + tzo * 1000 * 60 + 24 * 60 * 60 * 1000);
        console.log(t);

        const u = t.toISOString();
        setLastDate(u);
        console.log(u);
    }

    function passFilter(record) {

        if (userFilter != "--All--" && record.actor != userFilter && record.user != userFilter) {
            return false;
        }
        if (eventFilter != "--All--" && record.operation != eventFilter) {
            return false;
        }
        if (firstDate && (record.timestamp < firstDate)) {
            return false;
        }
        if (lastDate && (record.timestamp > lastDate)) {
            return false;
        }
        return true;
    }


    if (reverseSort) {
        auditRecords.reverse();
    }

    const today = new Date();
    const now = today.toISOString().split('T')[0];


    console.log(eventFilter);
    console.log(userFilter);

    const sortArrow = reverseSort ? (
        <svg width="24" height="24" style={{ fill: "var(--body-color)", transform: "rotate(180deg)" }}><use href="#angle"></use></svg>
    ) : (
        <svg width="24" height="24" style={{ fill: "var(--body-color)" }}><use href="#angle"></use></svg>
    )


    return (
        <Modal
            show={props.show}
            onHide={onClose}
            animation={false}
            centered
            dialogClassName="wide-dialog"
        >
            <ModalCross onClose={onClose}></ModalCross>

            <div className="modalTitle" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div className="h2">Audit</div>

                <div>
                    <input class="datapicker" aria-label="Date from" type="date" max={now} min={"2020-01-01"}
                        onInput={onFirstDate}
                        onСhange={elogChange} /><span> &mdash; </span>
                    <input class="datapicker" aria-label="Date to" type="date" max={now}
                        onInput={onLastDate}
                        onСhange={elogChange} />
                </div>
                <div>
                    {/*
                    <svg width="24" height="24" style={{ cursor: "pointer", marginRight: 16 }}>
                        <use href="#sliders"></use>
                    </svg>
    */}

                    <svg width="24" height="24" title="Refersh" onClick={refresh} style={{ cursor: "pointer" }}>
                        <use href="#arrow-clockwise"></use>
                    </svg>
                </div>
            </div>

            <Modal.Body>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ margin: "0 8px 0 8px" }}>User</span>
                    <Select
                        style={{ height: 40, borderRadius: 4, paddingLeft: 16, minWidth: 300 }}
                        options={allUsers}
                        labelField="label"
                        valueField="value"
                        values={[{ label: "--All--", value: "--All--" }]}
                        onChange={(values) => {
                            console.log(values);
                            setUserFilter(values[0].value);
                        }}
                        placeholder="User Filter"
                    />
                    <span style={{ margin: "0 8px 0 32px" }}>Event</span>
                    <Select
                        style={{ height: 40, borderRadius: 4, paddingLeft: 16, minWidth: 300 }}
                        options={allEvents}
                        labelField="label"
                        valueField="value"
                        values={[{ label: "--All--", value: "--All--" }]}
                        onChange={(values) => {
                            console.log(values);
                            setEventFilter(values[0].value);
                        }}
                        placeholder="Event filter"
                    />
                </div>

                <div class="custom-scroll fixed-head-table-wrapper" style={{ maxHeight: "calc(100vh - 350px)" }}>
                    <table>
                        <thead>
                            <th style={{ paddingLeft: 8, cursor: "pointer" }} onClick={() => setReverseSort(!reverseSort)}>Timestamp {sortArrow}</th>
                            <th style={{ paddingLeft: 8 }}>Actor</th>
                            <th style={{ paddingLeft: 8 }}>Event</th>
                            <th style={{ paddingLeft: 8 }}>args</th>
                        </thead>
                        <tbody>
                            {auditRecords.map(r => passFilter(r) ? (
                                <tr>
                                    <td style={{ paddingLeft: 8, textWrap: "nowrap" }}>{new Date(r.timestamp).toLocaleString()}</td>
                                    <td style={{ paddingLeft: 8 }}>{r.actor}</td>
                                    <td style={{ paddingLeft: 8 }}>{r.operation}</td>
                                    <td style={{ paddingLeft: 8 }}>{r.user ? r.user : ""}</td>
                                </tr>
                            ) : ""
                            )}

                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AuditModal;
