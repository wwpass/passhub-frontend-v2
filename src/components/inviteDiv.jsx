import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, getVerifier } from "../lib/utils";
import Button from "react-bootstrap/Button";

function InviteDiv(props) {
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");


  const queryClient = useQueryClient();

  const newUserAction = () => {

    return axios
      .post(`${getApiUrl()}iam.php`, {
          verifier: getVerifier(),
          operation: "newuser",
          email,
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
        setErrorMsg("Server error. Please try again later" );
      });
  }

  const newUserMutation = useMutation({
    mutationFn: newUserAction,
    onSuccess: data => {
      queryClient.invalidateQueries(["userList"], { exact: true })
    },
  })  

  const submitEmail = () => {
    newUserMutation.mutate();
  };

  const inputOnFocus = () => {
    setErrorMsg("");
  };

  const inputOnChange = (event) => {
    setEmail(event.target.value);
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

    let licensed = props.licensedUsers ? <><br></br><span> licensed users: {props.licensedUsers}</span></> : null;
    let users = <span>users: {props.users.length}</span>;

    return (


      <div
        style={{
          display: "flex",
          background: "#eee",
          padding: "16px",
          justifyContent: "space-between",
        }}
      >
          <div style={{display:"none"}}>
            {users}
            {licensed}
          </div>

          <span style={{ color: "red" }}>{errorMsg}</span>


        <div style={{ display: "flex", alignItems: "center" }}>
          Authorize
          <input
            style={{
              margin: "0 -1.3em 0 0.5em",
              height: "2em",
              width: "20em",
              outline: "none",
            }}
            type="email"
            spellcheck="false"
            placeholder="Email"
            onFocus={inputOnFocus}
            onChange={inputOnChange}
            onKeyDown={inputOnKeyDown}
            value={email}
          />
          <svg
            onClick={clearInput}
            width="15"
            height="15"
            style={{
              fill: "#aaa",
              cursor: "pointer",
            }}
          >
            <use href="#circle-x"></use>
          </svg>
          <Button
            className="btn btn-sm btn-primary"
            style={{ verticalAlign: "top", marginLeft: "2em" }}
            onClick={submitEmail}
          >
            Ok
          </Button>
        </div>
      </div>
    );
}

export default InviteDiv;
