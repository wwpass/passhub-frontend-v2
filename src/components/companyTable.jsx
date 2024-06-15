// import React from "react";
import CompanyRecord from "./companyRecord";



function CompanyTable(props) {

  const companies = props.companies.toSorted((a, b) => a.name.localeCompare(b.name))

  return (

    <div className="custom-scroll fixed-head-table-wrapper" style={{ minHeight: 350 }}>
      <table>
        <thead>
          <tr style={{ color: "rgba(27,27,38,0.5)", fontSize: "14px" }}>
            <th style={{ width: "40%" }}>Company name</th>
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

          {companies.map((c) => (
            <CompanyRecord
              key={c.name}
              company={c}
              gotoCompanyAdmin={props.gotoCompanyAdmin}
            />
          ))}

        </tbody>
      </table>
    </div>
  );
}

export default CompanyTable;
