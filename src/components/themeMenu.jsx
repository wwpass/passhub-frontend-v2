import { contextMenu, Menu, Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import axios from "axios";
import { getApiUrl, getVerifier, humanReadableFileSize } from "../lib/utils";



const themes = ["theme-lite", "theme-dark2", "theme-dark5", "theme-darkgreen", /* "theme-darkgreen2" */];


function switchTheme(theme) {

  document.querySelector("body").classList.remove(...themes);

  document.querySelector("body").classList.add(theme);

  axios
    .post(`${getApiUrl()}account.php`, {
      verifier: getVerifier(),
      operation: "theme",
      theme
    })
}

function ThemeMenu(props) {

  function onVisibilityChange(isVisible) {
    if (!isVisible) {
      props.onHidden();
    }
  }

  return (
    <Menu id={"theme-menu-id"} onVisibilityChange={onVisibilityChange}>
      {themes.map(t =>
        <Item onClick={() => switchTheme(t)}> {t.substring(6)}</Item>
      )}
    </Menu>

  )
}

export default ThemeMenu;
