import React from "react";
import "./App.css";

export const CELL_SIZE = 100;
export const WIDTH = 500;
export const HEIGHT = 500;

export const Cell = (props) => {
  
    const { positionX, positionY, color, value, isEnabled } = props;
    return (
      <div
        className="Cell"
        style={{
          left: `${CELL_SIZE * positionX}px`,
          top: `${CELL_SIZE * positionY}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          background: `${color}`,
          pointerEvents: isEnabled ? `auto` : `none`
        }}
      >
        <h1>{value}</h1>
      </div>
  );
}
