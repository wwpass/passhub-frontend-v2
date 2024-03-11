import React, { useState } from "react";
import Col from "react-bootstrap/Col";

import {
    Menu,
    Item,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import Group from "./group";

const cmpByName = ((a, b) => a.name.localeCompare(b.name));

export default function GroupPane(props) {

    const groups = props.groups.toSorted(cmpByName)

    function showUserPane() {
        document.querySelector('#user-pane').classList.remove("d-none");
        document.querySelector('.group_pane').classList.add("d-none");
    }

    return (
        <Col
            className="col-xl-3 col-lg-4 col-md-5 col-sm-5 col d-none d-sm-block group_pane"
        >

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >

                <div className="d-sm-none" onClick={showUserPane} style={{ textAlign: "left", cursor: "pointer", color: "var(--link-color)", padding: "0 0 12px 24px" }}>&lt; User Management</div>

                <div className="folders-header" style={{ paddingBottom: 36 }}>USER GROUPS</div>

                <div className="safe_scroll_control custom-scroll">
                    {groups.map(group => (
                        <Group
                            group={group}
                        />
                    ))}
                </div>

                <div
                    className="add_safe"
                    onClick={() => {
                        props.onAddGroup();
                    }}
                >
                    Add Group
                </div>

            </div>

            <Menu id={"group-menu"}>
                {["Users", "Safes", "Rename", "Delete"].map((itemName) => (
                    <Item onClick={(e) => {
                        props.handleGroupMenuClick(itemName, e.props.group);
                    }}
                    >
                        {itemName}
                    </Item>
                ))}
            </Menu>
        </Col>
    );
}
