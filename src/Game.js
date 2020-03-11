import React from "react";
import "./Game.css";
import Login from "./Login";

const CELL_SIZE = 100;
const WIDTH = 500;
const HEIGHT = 500;

class Cell extends React.Component {
  render() {
    const { x, y, color } = this.props;
    //console.log(x, y, color);
    return (
      <div
        className="Cell"
        style={{
          left: `${CELL_SIZE * x + 1}px`,
          top: `${CELL_SIZE * y + 1}px`,
          width: `${CELL_SIZE - 1}px`,
          height: `${CELL_SIZE - 1}px`,
          background: `${color}`
        }}
      />
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

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  generateTresures() {
    let arr_tresures = [];
    for (let i = 0; i < 3; i++) {
      let x = this.getRandomInt(5);
      let y = this.getRandomInt(5);
      if (arr_tresures.includes({ x, y })) continue;
      this.board[x][y] = true;
      arr_tresures.push({ x: x, y: y });
    }
    console.log(arr_tresures);
  }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    };
  }

  makeCells = () => {
    let cells = [];
    let color = `blue`;
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        if (this.board[x][y]) color = `coral`;
        else color = `white`;
        cells.push({ x, y, color });
      }
    }
    return cells;
  };

  check_neighbours(x, y) {
    let diagonal_neighbors = [
      { x_n: -1, y_n: -1 },
      { x_n: -1, y_n: 1 },
      { x_n: 1, y_n: 1 },
      { x_n: 1, y_n: -1 }
    ];

    let side_neighbors = [
      { x_n: -1, y_n: 0 },
      { x_n: 0, y_n: 1 },
      { x_n: 1, y_n: 0 },
      { x_n: 0, y_n: -1 }
    ];

    if (this.state.tresures.includes({ x, y })) {
      return "T";
    }

    for (let i = 0; i < diagonal_neighbors.length; i++) {
      let x1 = x + diagonal_neighbors[i].x_n;
      let y1 = y + diagonal_neighbors[i].y_n;
      if (this.state.tresures.includes({ x: x1, y: y1 })) return "2";
    }

    for (let i = 0; i < side_neighbors.length; i++) {
      let x1 = x + side_neighbors[i].x_n;
      let y1 = y + side_neighbors[i].y_n;
      if (this.state.tresures.includes({ x: x1, y: y1 })) return "3";
    }

    return "1";
  }

  handleClick = event => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    this.score++;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      //invoke functions for checking and assigning values(1,2,3,T)/scores
      this.check_neighbours(x, y);
    }

    this.setState({ cells: this.makeCells() });
  };

  runGame = () => {
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells() });
  };

  stopGame = () => {
    this.setState({ isRunning: false });
  };

  runIteration() {
    let newBoard = this.board;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
      }
    }

    this.board = newBoard;
    this.setState({ cells: this.makeCells() });
  }

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
                console.log(cell.color);
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
