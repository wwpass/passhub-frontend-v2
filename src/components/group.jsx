import {
    contextMenu,
  } from "react-contexify";
  import "react-contexify/dist/ReactContexify.css";

function Group(props) {
    
      const showGroupMenu = (e) => {
        contextMenu.show({
          id: "group-menu",
          event: e,
          props: { group: props.group },
        });
      };

    return (
        <div className="group" onClick={ showGroupMenu } >{props.group.name}</div>
    )
}

export default Group;
