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

/*
const audit = (props) => {


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

    console.log(data);

    return axios
        .post(`${getApiUrl()}iam.php`, {
            verifier: getVerifier(),
            operation: "audit",
        })
        .then((response) => {
            const result = response.data;
            console.log(result);

            if (result.status === "Ok") {
                const auditRecords = JSON.parse(result.data);
                console.log(auditRecords);
                return "Ok";
            }
            if (result.status === "login") {
                window.location.href = "expired.php";
                return;
            }
            // setErrorMsg(result.status);
            return;
        })
        .catch((err) => {
            console.log(err);
            // setErrorMsg("Server error. Please try again later");
        });
}

*/

function AuditModal(props) {

    if (!props.show) {
        return null;
    }
    const [errorMsg, setErrorMsg] = useState("");

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
                            <th style={{ paddingLeft: 8 }}>Timestamp</th><th>User</th><th>Operation</th><th>args</th>
                        </thead>
                        <tbody>
                            {auditRecords.map(r => (
                                <tr>
                                    <td style={{ paddingLeft: 8 }}>{new Date(r.timestamp).toLocaleString()}</td><td>{r.actor}</td><td>{r.operation}</td>
                                    <td>{r.user ? r.user : ""}</td>
                                </tr>
                            )
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
