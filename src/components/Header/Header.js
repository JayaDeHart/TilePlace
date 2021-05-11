import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import ColorPicker from "./ColorPicker";
import ColorContext from "../../context/colorContext";
import TutorialModal from "./TutorialModal";
import "./Header.css";

function Header() {
  const [open, setOpen] = useState(false);
  let { activeColor, setActiveColor } = useContext(ColorContext);
  function resetColor() {
    setActiveColor(null);
  }
  return (
    <div className="header-main-container">
      <div className="header-title">TilePlace.io</div>
      <div className="header-options">
        <div className="header-button">
          <Button
            onClick={() => {
              setOpen(true);
            }}
            variant="contained"
          >
            Tutorial
          </Button>
        </div>
        {open && <TutorialModal onClose={() => setOpen(false)} />}
        <div className="header-button">
          <Button variant="contained" onClick={resetColor}>
            Clear Color
          </Button>
        </div>
      </div>
      <div className="header-color-picker">
        <ColorPicker />
      </div>
    </div>
  );
}

export default Header;
