import React, { useContext } from "react";
import ColorPicker from "./ColorPicker";
import ColorContext from "../../context/colorContext";
import "./Header.css";

function Header() {
  let { activeColor, setActiveColor } = useContext(ColorContext);
  function resetColor() {
    setActiveColor(null);
  }
  return (
    <div className="header-main-container">
      <div className="header-title">TilePlace.io</div>
      <div className="header-options">
        <p>Tutorial</p>
        <p onClick={resetColor}>Movement Mode</p>
      </div>
      <div className="header-color-picker">
        <ColorPicker />
      </div>
    </div>
  );
}

export default Header;
