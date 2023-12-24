import { useMutation, useQueryClient } from "@tanstack/react-query";

import Dropdown from "react-bootstrap/Dropdown";

import { getApiUrl, getVerifier } from "../lib/utils";
import axios from "axios";


function UserRecord(props) {

    const queryClient = useQueryClient();

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
        queryClient.invalidateQueries(["userList"], { exact: true });
      },
    })  

    const changeRole = (newRole, oldRole) => {
    if (newRole !== oldRole) {
      changeRoleMutation.mutate(newRole);
    }
  };

    let user = props.user;

    let role = "active";
    if (user.disabled) {
      role = "disabled";
    } else if (user.site_admin) {
      role = "admin";
    } else if (!user._id) {
      role = "invited";
    }

    const id = btoa(user.mail).replace(/=/g, "");

    let seen = "";
    if (props.user.status !== "invited") {
      seen = new Date(props.user.lastSeen).toLocaleString();
    }

    if (props.me) {
      return (
        <tr>
          <td></td>
          <td style={{ paddingLeft: "1em" }}>
            <b>{role}</b>
          </td>
          <td className="email">
            <b>{user.email}</b>
          </td>
          <td className="d-none d-lg-table-cell" style={{ textAlign: "right", paddingRight:"0.5em"}}>
            <b>That's you</b>
          </td>
        </tr>
      );
    }
    if (role === "invited") {
      return (
        <tr>
          <td
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.showDelDialog({ email: user.email, id: user.id });
            }}
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
          </td>
          <td style={{ paddingLeft: "1em" }}>authorized</td>
          <td className="email">{props.user.email}</td>
          <td className="d-none d-lg-table-cell"></td>
        </tr>
      );
    }

    return (
      <tr>
        <td
          style={{ cursor: "pointer" }}
          onClick={() => {
            props.showDelDialog({ email: user.email, id: user._id });
          }}
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
        </td>
        <td>
          <Dropdown
            onSelect={(newRole) => {
              changeRole(newRole, role);
            }}
          >
            <Dropdown.Toggle
              id={id}
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
        </td>
        <td className="email">{props.user.email}</td>
        <td className="d-none d-lg-table-cell" style={{ textAlign: "right", paddingRight: "0.5em" }}>
            {new Date(props.user.lastSeen).toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
        </td>
      </tr>
    );
}

export default UserRecord;
