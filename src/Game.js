import React from "react";
import "./Game.css";
import Login from "./Login";

const CELL_SIZE = 100;
const WIDTH = 500;
const HEIGHT = 500;

class Cell extends React.Component {
  render() {
    const { x, y, color } = this.props;
    return (
      <div
        className="Cell"
        style={{
          left: `${CELL_SIZE * x}px`,
          top: `${CELL_SIZE * y}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          background: `${color}`
        }}
      ></div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
    this.tresures = this.generateTresures();
    this.user = null;
    this.score = 0;
    this.handleClick = this.handleClick.bind(this);
    this.runGame = this.runGame.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  state = {
    cells: [],
    isRunning: false,
    isUser: false
  };

  makeEmptyBoard() {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }

  check_exists(y, x, arr) {
    if (arr.some(item => item.x === x && item.y === y)) {
      console.log("Found");
      return true;
    } else {
      console.log("Not found");
      return false;
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  generateTresures() {
    let arr_tresures = [];
    let i = 0;
    while (i < 3) {
      let x = this.getRandomInt(5);
      let y = this.getRandomInt(5);
      if (this.check_exists(y, x, arr_tresures)) continue;
      this.board[y][x] = true;
      arr_tresures.push({ y, x });
      i++;
    }
    console.log(arr_tresures);
    return arr_tresures;
  }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    console.log(rect.left, rect.y);

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    };
  }

  makeCells = () => {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let color = `white`;
        cells.push({ x, y, color });
      }
    }
    return cells;
  };

  check_neighbours(y, x) {
    let val_cell = "1";
    console.log(y, x);
    let diagonal_neighbors = [
      { y_n: -1, x_n: -1 },
      { y_n: -1, x_n: 1 },
      { y_n: 1, x_n: 1 },
      { y_n: 1, x_n: -1 }
    ];

    let side_neighbors = [
      { y_n: -1, x_n: 0 },
      { y_n: 0, x_n: 1 },
      { y_n: 1, x_n: 0 },
      { y_n: 0, x_n: -1 }
    ];

    if (this.check_exists(y, x, this.tresures)) {
      return "T";
    } else {
      for (let i = 0; i < diagonal_neighbors.length; i++) {
        let x1 = x + diagonal_neighbors[i].x_n;
        let y1 = y + diagonal_neighbors[i].y_n;
        console.log(y1, x1);
        if (this.check_exists(y1, x1, this.tresures)) {
          val_cell = "2";
          console.log(val_cell);
          break;
        }
      }

      for (let i = 0; i < side_neighbors.length; i++) {
        let x1 = x + side_neighbors[i].x_n;
        let y1 = y + side_neighbors[i].y_n;
        if (this.check_exists(y1, x1, this.tresures)) {
          val_cell = "3";
          console.log(val_cell);
          break;
        }
      }
    }
    return val_cell;
  }

  changeCells = (cells_arr, y, x, cell_val) => {
    const objIndex = cells_arr.findIndex(obj => obj.y === y && obj.x === x);
    console.log(cells_arr[objIndex]);
    if (cell_val.includes("T")) cells_arr[objIndex].color = `coral`;
    if (cell_val.includes("3")) cells_arr[objIndex].color = `aqua`;
    if (cell_val.includes("2")) cells_arr[objIndex].color = `green`;
    if (cell_val.includes("1")) cells_arr[objIndex].color = `blue`;
    return cells_arr;
  };

  handleClick = event => {
    let cell_val;
    const elemOffset = this.getElementOffset();
    console.log(event.clientX, event.clientY);

    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      cell_val = this.check_neighbours(y, x);
      console.log(cell_val);
    }

    this.setState({
      cells: this.changeCells(this.state.cells, y, x, cell_val)
    });
  };

  runGame = () => {
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells() });
  };

  stopGame = () => {
    this.setState({ isRunning: false });
  };

  runIteration() {}

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board
   * @param {int} x
   * @param {int} y
   */
  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (
        x1 >= 0 &&
        x1 < this.cols &&
        y1 >= 0 &&
        y1 < this.rows &&
        board[y1][x1]
      ) {
        neighbors++;
      }
    }

    return neighbors;
  }

  handleClear = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ cells: this.makeCells() });
  };

  newUser = flag => {
    this.setState({ isUser: true });
    this.user = this.board;
  };

  render() {
    const { cells, isRunning, isUser } = this.state;
    return (
      <div>
        {!isUser ? (
          <Login onUser={this.newUser} />
        ) : (
          <div>
            <div
              className="Board"
              style={{
                width: WIDTH,
                height: HEIGHT,
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
              }}
              onClick={this.handleClick}
              ref={n => {
                this.boardRef = n;
              }}
            >
              {cells.map(cell => {
                return (
                  <Cell
                    x={cell.x}
                    y={cell.y}
                    color={cell.color}
                    key={`${cell.x},${cell.y}`}
                  />
                );
              })}
            </div>

            <div className="controls">
              <p>Your Score</p>
              <h3>{this.score}</h3>
              <p>points</p>
              {isRunning ? (
                <button className="button" onClick={this.stopGame}>
                  Stop
                </button>
              ) : (
                <button className="button" onClick={this.runGame}>
                  Run
                </button>
              )}
              <button className="button" onClick={this.handleClear}>
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
