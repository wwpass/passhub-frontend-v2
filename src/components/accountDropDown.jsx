// import React, { useState, useEffect, useRef } from 'react';

import ThemeMenu from "./themeMenu";
import { contextMenu, Menu, Item } from "react-contexify";

import { getApiUrl, getVerifier, humanReadableFileSize, logMeOut } from "../lib/utils";

import { getUserData } from "../lib/userData";


function perCent(part, all) {
  if (part == 0) {
    return 0;
  }

  let result = Math.floor((part * 100) / all);
  if (result < 2) {
    return 2;
  }
  if (result > 100) {
    return 100;
  }
  return result;
}

function AccountDropDown(props) {

  if (!props.show) {
    return null;
  }

  const handleBodyClick = (e) => {
    e.stopPropagation();
  };

  const handleOuterClick = () => {
    props.onClose();
  };

  const handleLogout = () => {
    logMeOut();
  };

  const handleMenuCommand = (e, cmd) => {
    e.stopPropagation();

    if (cmd == "theme") {

      e.preventDefault();
      contextMenu.show({ id: "theme-menu-id", event: e });
      return;
    }

    props.onClose();


    props.onMenuCommand(cmd);
  };

  const onUpgrade = () => {
    /*
    window.open("payments/checkout.php", "passhub_payment");
    this.props.onClose();
    */
    props.onMenuCommand("upgrade");
  };

  const accountData = getUserData();
  const nmenu = Array.isArray(props.nmenu) ? props.nmenu : [];

  const modalClasses = props.show ? "pmodal" : "pmodal d-none";

  const storage = (
    <b>
      {humanReadableFileSize(accountData.totalStorage ? accountData.totalStorage : 0)}
    </b>
  );
  const records = <b>{accountData.totalRecords ? accountData.totalRecords : 0}</b>;

  let right = document.body.getBoundingClientRect().right - document.querySelector(".account-dropdown-button").getBoundingClientRect().right - 27;

  if (right <= 16) {
    right = 16;
  }

  return (
    <div className={modalClasses} onClick={handleOuterClick}>
      <div
        className="pmodal-body account"
        onClick={handleBodyClick}
        style={{ right }}
      >
        <div style={{ marginBottom: "16px" }}>
          {accountData.email && <div>{accountData.email}</div>}
          {('upgrade' in accountData) && (
            <div
              style={{
                fontSize: "13px",
                lineHeight: "24px",
                color: "#979797",
                display: "flex",
                gap: 20
              }}
            >
              <span>Free account</span>
              <a className="link" href="#" onClick={onUpgrade}>
                Upgrade
              </a>
            </div>
          )}
        </div>

        {accountData.maxRecords ? (
          <div style={{ marginBottom: "18px" }}>
            {records} of {accountData.maxRecords} records
            <div
              style={{
                height: "4px",
                background: "#E7E7EE",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  height: "4px",
                  width: `${perCent(
                    accountData.totalRecords,
                    accountData.maxRecords
                  )}%`,
                  background: "#00BC62",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: "18px" }}>{records} records</div>
        )}

        {accountData.maxStorage ? (
          <div style={{ marginBottom: "24px" }}>
            {storage} of {humanReadableFileSize(accountData.maxStorage)}
            <div
              style={{
                height: "4px",
                background: "#E7E7EE",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  height: "4px",
                  width: `${perCent(
                    accountData.totalStorage,
                    accountData.maxStorage
                  )}%`,
                  background: "#00BC62",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: "24px" }}>{storage}</div>
        )}

        {('upgrade' in accountData) && (
          <div>
            <button
              className="btn btn-primary upgrade-button"
              onClick={onUpgrade}
            >
              Get more
            </button>
          </div>
        )}

        <div
          className="account-menu-item"
          onClick={(e) => handleMenuCommand(e, "Account settings")}
        >
          <svg width="24" height="24">
            <use href="#f-nut"></use>
          </svg>
          Account settings
        </div>

        <div
          className="account-menu-item"
          onClick={(e) => {
            handleMenuCommand(e, "Help");
          }}
        >
          <svg width="24" height="24">
            <use href="#f-lightbulb"></use>
          </svg>
          How it works (Help)
        </div>

        <div
          className="account-menu-item"
          onClick={(e) => handleMenuCommand(e, "Export")}
        >
          <svg width="24" height="24">
            <use href="#f-upload"></use>
          </svg>
          Export
        </div>

        <div
          className="account-menu-item"
          onClick={(e) => handleMenuCommand(e, "Import")}
        >
          <svg width="24" height="24">
            <use href="#f-download"></use>
          </svg>
          Import
        </div>

        {nmenu.includes("Bind key") && (
          <div
            className="account-menu-item"
            onClick={(e) => handleMenuCommand(e, "Bind key")}
          >
            {/*
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="15.5" r="4.5"></circle>
              <path d="M10.7 12.3 20 3M16 7l3 3M14 9l2 2"></path>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-qr-code-scan" viewBox="0 0 16 16">
              <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z" />
              <path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z" />
              <path d="M7 9H2v5h5zm-4 1h3v3H3zm8-6h1v1h-1z" />
              <path d="M9 2h5v5H9zm1 1v3h3V3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8zm2 2H9V9h1zm4 2h-1v1h-2v1h3zm-4 2v-1H8v1z" />
              <path d="M12 9h2V8h-2z" />
            </svg>
            */}


            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="currentColor" class="bi bi-qr-code" viewBox="0 0 16 16">
              <path d="M2 2h2v2H2z" />
              <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
              <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
              <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
              <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
            </svg>


            WWPass keys
          </div>
        )}

        {accountData.msp ? (
          <div
            className="account-menu-item"
            onClick={(e) => {
              handleMenuCommand(e, "Msp");
            }}
          >
            <svg width="24" height="24">
              <use href="#i-wrench"></use>
            </svg>
            MSP
          </div>

        ) : (accountData.site_admin ? (
          <div
            className="account-menu-item"
            onClick={(e) => {
              handleMenuCommand(e, "Iam");
            }}
          >
            <svg width="24" height="24">
              <use href="#i-wrench"></use>
            </svg>
            Users
          </div>
        ) : (
          <div
            className="account-menu-item"
            onClick={(e) => handleMenuCommand(e, "Contact us")}
          >
            <svg width="24" height="24">
              <use href="#f-chatCircleText"></use>
            </svg>
            Contact us
          </div>
        ))}

        {(accountData.theme != "disabled") && (
          <div
            className="account-menu-item"
            onClick={(e) => handleMenuCommand(e, "theme")}
          >
            <svg width="24" height="24" style={{ opacity: 0.6 }}>
              <use href="#theme-dark"></use>
            </svg>
            Theme
          </div>
        )}
        <ThemeMenu
          onHidden={props.onClose}
          theme={accountData.theme}
        />

        <div
          className="account-menu-item"
          style={{
            color: "var(--danger-color)",
          }}
          onClick={handleLogout}
        >
          <svg width="24" height="24">
            <use href="#f-signout"></use>
          </svg>
          Log out
        </div>
      </div>
    </div>
  );
}

export default AccountDropDown;
