import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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

    const onClose = () => {
        props.onClose();
    };

    const { data: datax, isLoading } = useQuery({
        queryKey: ["audit"],
        queryFn: () => auditQuery().then(data => {
            return data;
        }),
    });

    if (isLoading) {
        console.log('isLoading');
        return null;
    }

    console.log('datax');
    console.log(datax);

    const auditRecords = JSON.parse(datax.data);

    console.log('auditRecords');
    console.log(auditRecords);

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
        if (firstDate && (record.timestamp < firstDate)) {
            return false;
        }
        if (lastDate && (record.timestamp > lastDate)) {
            return false;
        }
        return true;
    }

    const today = new Date();
    const now = today.toISOString().split('T')[0];



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
                    <svg width="24" height="24" style={{ cursor: "pointer", marginRight: 16 }}>
                        <use href="#sliders"></use>
                    </svg>

                    <svg width="24" height="24" style={{ cursor: "pointer" }}>
                        <use href="#arrow-clockwise"></use>
                    </svg>
                </div>
            </div>

            <Modal.Body>
                <div class="table-fixed-head">
                    <table>
                        <thead>
                            <th style={{ paddingLeft: 8 }}>Timestamp</th>
                            <th style={{ paddingLeft: 8 }}>User</th>
                            <th style={{ paddingLeft: 8 }}>Operation</th>
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
