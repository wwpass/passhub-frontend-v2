// import React from "react";
import UserRecord from "./userRecord";


// const cmpByEmail = ((a, b) => a.email.localeCompare(b.email));


function UserTable(props) {

  // const users = props.users.toSorted(cmpByEmail);
  const users = [...props.users];
  users.sort((a, b) => a.email.localeCompare(b.email));



  return (

    <div className="custom-scroll fixed-head-table-wrapper" style={{ minHeight: 350 }}>
      <table>
        <thead>
          <tr style={{ color: "rgba(27,27,38,0.5)", fontSize: "14px" }}>
            <th style={{ width: "40%" }}>Email</th>
            <th className="d-none d-sm-table-cell" style={{ minWidth: "8em", paddingRight: "12px", textAlign: "right", }}>Status</th>
            <th
              className="d-none d-lg-table-cell col-lg-4 col-xl-3"
              style={{
                minWidth: "10em",
                textAlign: "right",
                paddingRight: "1em",
              }}
              title={Intl.DateTimeFormat().resolvedOptions().timeZone}
            >
              Last seen
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            // props.me is undefined for msp; u_id is undefined for invited users
            const me = u._id && props.me && (u._id === props.me);
            if (!u.email.includes(props.searchString)) {
              return null;
            }
            return (
              <UserRecord
                key={u.email}
                user={u}
                me={me}
                LDAP={props.LDAP}
                showDelDialog={props.showDelDialog}
                showUserModal={props.showUserModal}
                userStatusCB={props.userStatusCB}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
