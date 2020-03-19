const ROWS = 5;
const COLLS = 5;
const CELL_SIZE = 100;

const makeEmptyBoard = () => {
  let board = [];
  for (let x = 0; x < ROWS; x++) {
    board[x] = [];
    for (let y = 0; y < COLLS; y++) {
      board[x][y] = false;
    }
  }

  return board;
};

const getElementOffset = boardRef => {
  const rect = boardRef.getBoundingClientRect();
  const doc = document.documentElement;

  return {
    x: rect.left + window.pageXOffset - doc.clientLeft,
    y: rect.top + window.pageYOffset - doc.clientTop
  };
};

const obtainCoordinatesFromClick = (event, elemOffset) => {
  const offsetX = event.clientX - elemOffset.x;
  const offsetY = event.clientY - elemOffset.y;

  const x = Math.floor(offsetX / CELL_SIZE);
  const y = Math.floor(offsetY / CELL_SIZE);
  let pointOnMap = { x: x, y: y };
  return pointOnMap;
};

module.exports = {
  makeEmptyBoard,
  getElementOffset,
  obtainCoordinatesFromClick
};
