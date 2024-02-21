import React, { useState } from "react";
import Col from "react-bootstrap/Col";

import {
    Menu,
    Item,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import Group from "./group";


const cmpByName = ((a, b) => a.name.localeCompare(b.name));

const groupMenu1 = (
    <Menu id={"group-menu1"}>
        <Item>
            Item1
        </Item>
        <Item>
            Item2
        </Item>
        <Item>
            Item3
        </Item>
    </Menu>
);

export default function GroupPane(props) {

    const groups = props.groups.toSorted(cmpByName)


    return (
        <Col
            className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col d-sm-block group_pane"
        >

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <div className="folders-header" style={{ paddingBottom: 36 }}>USER GROUPS</div>

                <div className="safe_scroll_control custom-scroll d-sm-none">
                    {/*                    
                    {props.safes.map((s) => (
                        <MobileSafeNode
                            key={`m${s.id}`}
                            node={s}
                            onSelect={handleSelect}
                        />
                    ))} */}
                </div>

                <div className="safe_scroll_control custom-scroll d-none d-sm-block">
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
