import React, { useContext } from "react";
import ColorContext from "../../context/colorContext";
import "./Header.css";

function ColorItem(props) {
  let { setActiveColor } = useContext(ColorContext);
  function handleColorClick() {
    setActiveColor(props.color);
  }
  return (
    <div
      onClick={handleColorClick}
      style={{ backgroundColor: props.color }}
      className="color-item"
    ></div>
  );
}

export default ColorItem;
