import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Canvas from "./components/Canvas/Canvas";
import ColorContext from "./context/colorContext";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [activeColor, setActiveColor] = useState();

  return (
    <ColorContext.Provider value={{ activeColor, setActiveColor }}>
      <div className="main-container">
        <Header />
        <Canvas />
      </div>
    </ColorContext.Provider>
  );
}

export default App;
