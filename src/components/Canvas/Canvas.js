import React, { useEffect, useState, useRef, useContext } from "react";
import "./Canvas.css";
import io from "socket.io-client";
import ColorContext from "../../context/colorContext";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling", "flashsocket"],
});

function Canvas() {
  let [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { activeColor } = useContext(ColorContext);
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panState, setPanState] = useState({ x: 0, y: 0 });
  const [isPan, setIsPan] = useState(false);
  const [boardState, setBoardState] = useState();
  const canvasRef = useRef(null);

  useEffect(() => {
    async function fetchState() {
      let url = "http://localhost:5000/boardstate";
      try {
        const response = await fetch(url);
        const responseData = await response.json();
        setBoardState(responseData.state.state);
      } catch (err) {
        console.log(err);
      }
    }
    fetchState();
  }, []);

  useEffect(() => {
    socket.on("tilePlace", (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let { x, y, color } = data;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  }, []);

  function drawCanvas(boardState, ctx) {
    if (boardState) {
      for (let y = 0; y < 180; y++) {
        for (let x = 0; x < 320; x++) {
          ctx.fillStyle = boardState[y][x];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  function handleMouseDown(e) {
    if (!activeColor && scale > 1) {
      setIsPan(true);
      setDragStart({ x: e.pageX, y: e.pageY });
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function handleMouseMove(e) {
    setMousePos({ x: e.pageX - 763, y: e.pageY - 433 });
    if (isPan) {
      let deltaX = e.pageX - dragStart.x;
      let deltaY = e.pageY - dragStart.y;
      setPanState((panState) => {
        let x0 = panState.x + deltaX;
        let y0 = panState.y + deltaY;
        let x1 = x0 / (scale - 1);
        let y1 = y0 / (scale - 1);
        let initialX = clamp(x1, -480.8, 480.8);
        let initialY = clamp(y1, -270.4, 270.4);
        let finalX = initialX * (scale - 1);
        let finalY = initialY * (scale - 1);
        return {
          x: finalX,
          y: finalY,
        };
      });

      setDragStart({ x: e.pageX, y: e.pageY });
    }
  }

  function handleMouseUp(e) {
    setIsPan(false);
  }

  function handleWheel(e) {
    let change = e.deltaY * 0.01;
    setScale((scale) => {
      if (e.deltaY < 0) {
        setPanState({ x: 0, y: 0 });
      }
      if (scale + change >= 1 && scale + change <= 10) {
        return (scale += change);
      } else if (change > 1) {
        return 10;
      } else {
        return 1;
      }
    });
  }

  async function handleClick(e) {
    // let url = process.env.REACT_APP_CONNECTION_URL;
    let url = "http://localhost:5000/boardstate";
    if (activeColor) {
      let rect = e.target.getBoundingClientRect();
      let x = Math.floor((e.clientX - rect.left) / 3 / scale);
      let y = Math.floor((e.clientY - rect.top) / 3 / scale);

      //we might need this we might not
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = activeColor;
      ctx.fillRect(x, y, 1, 1);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ x, y, color: activeColor }),
        });
        if (!response.ok) {
          throw Error;
        }
      } catch (err) {
        console.log(err);
      }

      socket.emit("tilePlace", { x, y, color: activeColor });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    drawCanvas(boardState, ctx);
  }, [boardState]);

  let panStyle = {
    transform: `translate(${panState.x}px,${panState.y}px)`,
  };

  let nocursor;
  if (activeColor) {
    nocursor = { cursor: "none" };
  }

  return (
    <div
      style={nocursor}
      className="canvas-main-container"
      onMouseUp={handleMouseUp}
    >
      {activeColor && (
        <div
          style={{
            backgroundColor: activeColor,
            transform: `translate(${mousePos.x}px,${mousePos.y}px)`,
          }}
          className="cursor"
        ></div>
      )}
      <div className="scroll-handler">
        <div style={panStyle}>
          <canvas
            style={{
              transform: `scale(${scale})`,
              border: "1px solid #000000",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            height="180px"
            width="320px"
            ref={canvasRef}
          ></canvas>
        </div>
      </div>
      <br></br>
      {/* comment in to see board position data \/ */}
      {/* <div>
        <span>{JSON.stringify(panState)}</span>
        <span> {scale}</span>
      </div> */}
    </div>
  );
}

export default Canvas;
