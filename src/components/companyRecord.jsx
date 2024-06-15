import { useMutation, useQueryClient } from "@tanstack/react-query";

import Dropdown from "react-bootstrap/Dropdown";

import { getApiUrl, getVerifier } from "../lib/utils";
import axios from "axios";


function CompanyRecord(props) {

  const queryClient = useQueryClient();

  function gotoCompanyAdmin() {
    props.gotoCompanyAdmin(props.company);
  }

  //  let company = props.company;

  return (
    <tr>
      <td onClick={gotoCompanyAdmin}>{props.company.name}</td>
      <td>
        <div className="d-none d-sm-block">
        </div>
      </td>
      <td className="d-none d-lg-table-cell col-lg-4 col-xl-3" style={{ textAlign: "right", paddingRight: "0.5em" }}>
      </td>
    </tr>
  );
}

export default CompanyRecord;
