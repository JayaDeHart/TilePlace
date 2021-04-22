import React from "react";
import "./Header.css";
import ColorItem from "./ColorItem";
import colors from "./colors";
import { v4 as uuidv4 } from "uuid";

function ColorPicker() {
  return (
    <div className="color-picker">
      {colors.map((color) => (
        <ColorItem color={color} key={uuidv4()} />
      ))}
    </div>
  );
}

export default ColorPicker;
