import React from 'react';
import './App.css';

export const CELL_SIZE = 100;
export const WIDTH = 500;
export const HEIGHT = 500;

const defaultCOLOR = '#554562';

export const Cell = (props) => {
  const { positionX, positionY, color, value, isEnabled, isRevealed } = props;
  return (
    <div
      className="Cell"
      style={{
        left: `${CELL_SIZE * positionX}px`,
        top: `${CELL_SIZE * positionY}px`,
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
        background: isRevealed ? `${color}` : defaultCOLOR,
        pointerEvents: isEnabled ? 'auto' : 'none',
      }}
    >
      <h1>{isRevealed ? value : ''}</h1>
    </div>
  );
};
