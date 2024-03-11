// import React from "react";
import UserRecord from "./userRecord";


const cmpByEmail = ((a, b) => a.email.localeCompare(b.email));


function UserTable(props) {

  const users = props.users.toSorted(cmpByEmail)

  return (

    <div className="table-pane-scroll-control custom-scroll" style={{ overflow: "hidden auto" }}>
      <table className="iam_table">
        <thead>
          <tr style={{ color: "rgba(27,27,38,0.5)", fontSize: "14px" }}>
            <th style={{ width: "40%" }}>Email</th>
            <th className="d-none d-sm-block" style={{ minWidth: "8em", paddingRight: "12px", textAlign: "right", }}>Status</th>

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
            const me = u._id === props.me;
            if (!u.email.includes(props.searchString)) {
              return null;
            }
            return (
              <UserRecord
                key={u.email}
                user={u}
                me={me}
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
