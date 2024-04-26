import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import ModalCross from "./modalCross";


function CompanyModal(props) {

    if (!props.show) {
        return null;
    }

    const queryClient = useQueryClient();


    const [licensedUsers, setLicensedUsers] = useState(props.company.licensedUsers ? props.company.licensedUsers : 10);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        console.log('companyModal useEffect');
    }, []);

    function setCompanyProfile() {
        return axios
            .post(`${getApiUrl()}company.php`, {
                verifier: getVerifier(),
                operation: "setProfile",
                companyId: props.company._id,
                licensedUsers
            })
            .then(() => {
                queryClient.invalidateQueries(["companyList"], { exact: true })
                props.onClose();
            });
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onClose}
            animation={false}
            centered
        >
            <ModalCross onClose={props.onClose}></ModalCross>
            <div className="modalTitle">
                <div className="h2">Company {props.company.name}</div>
            </div>

            <Modal.Body>
                <label for="licensed-users">Licensed users:</label>
                <input
                    id="licensed-users"
                    type="text"
                    value={licensedUsers}
                    onChange={(e) => {
                        setLicensedUsers(e.target.value);
                        setErrorMsg("");
                    }} />

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={props.onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={setCompanyProfile}>
                    Ok
                </Button>

            </Modal.Footer>
        </Modal>
    )
}

export default CompanyModal;


/*
function companyProfileQuery() {
    console.log("companyProfile query called");

    return getCompanyProfile(props.company)
        .then(result => {

            if (result.data.status === "Ok") {
                return result.data
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

const { data: datax, isLoading } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: () => companyProfileQuery().then(data => {
        return data;
    }),
});

if (isLoading) {
    console.log('isLoading');
    return null;
}
console.log('datax');
console.log(datax);

const { profile } = datax;
*/
