import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { getApiUrl, getVerifier } from "../lib/utils";
import CompanyTable from './companyTable';



function downloadCompanyList() {
    return axios
        .post(`${getApiUrl()}company.php`, {
            verifier: getVerifier(),
            operation: "companies",
        });
}

function MspPage(props) {
    if (!props.show) {
        return null;
    }

    const [errorMsg, setErrorMsg] = useState("");
    const [companyName, setCompanyName] = useState("");

    const queryClient = useQueryClient();

    function companyListQuery() {
        console.log("companyList query called");

        return downloadCompanyList()
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
        queryKey: ["companyList"],
        queryFn: () => companyListQuery().then(data => {
            return data;
        }),
    });

    if (isLoading) {
        console.log('isLoading');
        return null;
    }

    const { companies } = datax;

    console.log(companies);

    const submitCompany = () => {
        if (companyName.trim() == "") {
            return;
        }
        return axios
            .post(`${getApiUrl()}company.php`, {
                verifier: getVerifier(),
                operation: "newcompany",
                name: companyName.trim(),
            })
            .then((response) => {
                const result = response.data;

                if (result.status === "Ok") {
                    setCompanyName("");
                    setErrorMsg("");
                    queryClient.invalidateQueries(["companyList"], { exact: true })
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

    const inputOnFocus = () => {
        setErrorMsg("");
    };

    const inputOnChange = (event) => {
        setCompanyName(event.target.value);
        setErrorMsg("");
    };

    const inputOnKeyDown = (event) => {
        if (event.key == "Enter") {
            setCompanyName(event.target.value);
            submitCompany();
        }
    };

    return (
        <div className="msp-page">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "0 24px"
                }}
            >
                <div>
                    <div>Managed Companies</div>

                    <div style={{ margin: "16px 0 8px", display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            placeholder="Company name"
                            style={{ flexGrow: 1 }}
                            onFocus={inputOnFocus}
                            onChange={inputOnChange}
                            onKeyDown={inputOnKeyDown}
                            value={companyName}
                        />
                        <Button onClick={submitCompany}>Add company</Button>
                    </div>
                    {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
                </div>
                <CompanyTable
                    companies={companies}
                    gotoCompanyAdmin={props.gotoCompanyAdmin}
                ></CompanyTable>

            </div>
        </div>
    )
}

export default MspPage;
