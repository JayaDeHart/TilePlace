import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ColorPicker from "./ColorPicker";
import ColorContext from "../../context/colorContext";
import "./Header.css";

function Header() {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  let { setActiveColor } = useContext(ColorContext);
  function resetColor() {
    setActiveColor(null);
  }
  return (
    <div className="header-main-container">
      <div className="header-title">TilePlace.io</div>
      <div className="header-options">
        <div className="header-button">
          <Button onClick={handleOpen} variant="outline-dark">
            Tutorial
          </Button>
        </div>
        <Modal show={open} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Tutorial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <li>Welcome to TilePlace.io</li>
              <li>
                TilePlace.io is a collaborative, live updating, pixel drawing
                app
              </li>
              <li>
                Use the mousewheel to zoom in, and click and drag to move around
                the canvas
              </li>
              <li>
                Click on a color in the top right, and click anywhere on the
                canvas to place a tile
              </li>
              <li>Make some cool art!</li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="header-button">
          <Button variant="outline-dark" onClick={resetColor}>
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
