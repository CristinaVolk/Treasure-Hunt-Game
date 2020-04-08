export const ROWS = 5;
export const COLLS = 5;
export const CELL_SIZE = 100;

export const makeEmptyBoard = () => {
  const board = [];
  for (let positionX = 0; positionX < ROWS; positionX += 1) {
    board[positionX] = [];
    for (let positionY = 0; positionY < COLLS; positionY += 1) {
      board[positionX][positionY] = false;
    }
  }
  return board;
};

export const enableTreasureMapBoard = (treasureBoard) => {
  treasureBoard.map((field) => {
    field.isEnabled = true;
  });
  return [...treasureBoard];
};

export const getElementOffset = (boardRef) => {
  const rect = boardRef.getBoundingClientRect();
  const doc = document.documentElement;

  return {
    positionX: rect.left + window.pageXOffset - doc.clientLeft,
    positionY: rect.top + window.pageYOffset - doc.clientTop,
  };
};

export const obtainCoordinatesFromClick = (event, elemOffset) => {
  const offsetX = event.clientX - elemOffset.positionX;
  const offsetY = event.clientY - elemOffset.positionY;

  const positionX = Math.floor(offsetX / CELL_SIZE);
  const positionY = Math.floor(offsetY / CELL_SIZE);
  const pointOnMap = { positionX, positionY };
  return pointOnMap;
};
