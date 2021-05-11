import React from "react";
import ReactDOM from "react-dom";
import "./Header.css";
import Button from "@material-ui/core/Button";

function TutorialModal(props) {
  return ReactDOM.createPortal(
    <div className="modal-fade-background">
      <div className="modal">
        <h1>Tutorial!</h1>
        <ul>
          <li>Welcome to TilePlace.io</li>
          <li>
            TilePlace.io is a collaborative, live updating, pixel drawing app
          </li>
          <li>
            Use the mousewheel to zoom in, and click and drag to move around the
            canvas
          </li>
          <li>
            Click on a color in the top right, and click anywhere on the canvas
            to place a tile
          </li>
          <li>Make some cool art!</li>
        </ul>
        <Button variant="contained" onClick={props.onClose}>
          Close
        </Button>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default TutorialModal;
