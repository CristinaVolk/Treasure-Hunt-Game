import React, { Component } from "react";
import "./App.css";

export const CELL_SIZE = 100;
export const WIDTH = 500;
export const HEIGHT = 500;

export default class Cell extends React.Component {
  render() {
    const { x, y, color, value, isEnabled } = this.props;
    return (
      <div
        className="Cell"
        style={{
          left: `${CELL_SIZE * x}px`,
          top: `${CELL_SIZE * y}px`,
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
}
