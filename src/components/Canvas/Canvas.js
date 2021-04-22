import React, { useEffect, useState, useRef, useContext } from "react";
import "./Canvas.css";
import io from "socket.io-client";
import ColorContext from "../../context/colorContext";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling", "flashsocket"],
});

function Canvas() {
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
    socket.on("update", (data) => {
      setBoardState(data.updateDescription.updatedFields.state);
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

  function handleMouseMove(e) {
    let pastLimitLeft = canvasRef.current.getBoundingClientRect().x > 288;
    let pastLimitTop = canvasRef.current.getBoundingClientRect().y > 145;
    let pastLimitRight = canvasRef.current.getBoundingClientRect().right < 1248;
    let pastLimitBottom =
      canvasRef.current.getBoundingClientRect().bottom < 685;
    let canMove = true;

    if (isPan) {
      let deltaX = e.pageX - dragStart.x;
      let deltaY = e.pageY - dragStart.y;
      if (pastLimitLeft && deltaX > 0) {
        canMove = false;
      }
      if (pastLimitRight && deltaX < 0) {
        canMove = false;
      }
      if (pastLimitTop && deltaY > 0) {
        canMove = false;
      }
      if (pastLimitBottom && deltaY < 0) {
        canMove = false;
      }
      if (canMove) {
        setPanState((panState) => {
          return {
            x: panState.x + deltaX,
            y: panState.y + deltaY,
          };
        });
        setDragStart({ x: e.pageX, y: e.pageY });
      }
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
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    drawCanvas(boardState, ctx);
  }, [boardState]);

  let panStyle;

  panStyle = {
    transform: `translate(${panState.x}px,${panState.y}px)`,
  };

  return (
    <div className="canvas-main-container" onMouseUp={handleMouseUp}>
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
      <div></div>
    </div>
  );
}

export default Canvas;
