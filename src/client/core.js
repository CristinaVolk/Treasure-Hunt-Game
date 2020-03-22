const ROWS = 5;
const COLLS = 5;
const CELL_SIZE = 100;

const makeEmptyBoard = () => {
  let board = [];
  for (let positionX = 0; positionX < ROWS; positionX++) {
    board[positionX] = [];
    for (let positionY = 0; positionY < COLLS; positionY++) {
      board[positionX][positionY] = false;
    }
  }
  return board;
};

const getElementOffset = boardRef => {
  const rect = boardRef.getBoundingClientRect();
  const doc = document.documentElement;

  return {
    positionX: rect.left + window.pageXOffset - doc.clientLeft,
    positionY: rect.top + window.pageYOffset - doc.clientTop
  };
};

const obtainCoordinatesFromClick = (event, elemOffset) => {
  const offsetX = event.clientX - elemOffset.positionX;
  const offsetY = event.clientY - elemOffset.positionY;

  const positionX = Math.floor(offsetX / CELL_SIZE);
  const positionY = Math.floor(offsetY / CELL_SIZE);
  let pointOnMap = { positionX: positionX, positionY: positionY };
  return pointOnMap;
};

module.exports = {
  makeEmptyBoard,
  getElementOffset,
  obtainCoordinatesFromClick
};
