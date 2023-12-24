import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavSpan from "./navSpan";

import logo from '../assets/new_ph_logo.svg';


// "public/img/new_ph_logo.svg"

function Header(props) {
  return (
    <>
      <Row>
        <Col
          style={{
            paddingLeft: 24,
            paddingRight: 16,
            margin: "16px auto 16px auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: props.narrowPage ? "680px" : "",
          }}
        >
          <div>
            <span
              onClick={props.gotoMain}
              style={{
                cursor: props.page === "Main" ? "default" : "pointer",
              }}
            >
              <img
                src={logo}
                alt="logo"
                style={{ width: "133px" }}
              />
            </span>
            <span className="d-md-none" id="xs_indicator"></span>
          </div>
          <NavSpan
            onSearchChange={props.onSearchChange}
            onSearchClear={props.onSearchClear}
            searchString={props.searchString}

            page={props.page}
            gotoIam={props.gotoIam}
          />
        </Col>

      </Row>
      {props.page === "Main" && (
        <Row className="d-sm-none">
          <div
            style={{
              flexGrow: 1,
              position: "relative",
              padding: 0
            }}
          >
            <input
              className="search_string"
              type="text"
              placeholder="Search.."
              autoComplete="off"
              onChange={props.onSearchChange}
              value={props.searchString}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(40px)",
                height: "48px",
                padding: "0 30px 0 10px",
              }}
            />

            <span
              className="search_clear"
              onClick={props.onSearchClear}
            >
              <svg width="0.7em" height="0.7em" className="item_icon">
                <use href="#cross"></use>
              </svg>
            </span>
          </div>
        </Row>
      )}
    </>

  );
}

export default Header;

