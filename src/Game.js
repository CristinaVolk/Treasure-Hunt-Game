import React from "react";
import "./Game.css";
import Login from "./Login";

const CELL_SIZE = 100;
const WIDTH = 500;
const HEIGHT = 500;

class Cell extends React.Component {
  render() {
    const { x, y, color, value, isRunning } = this.props;
    return (
      <div
        className="Cell"
        style={{
          left: `${CELL_SIZE * x}px`,
          top: `${CELL_SIZE * y}px`,
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          background: `${color}`,
          pointerEvents: isRunning ? `auto` : `none`
        }}
      >
        <h1>{value}</h1>
      </div>
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
    this.count = 0;
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

  check_exists = (y, x, arr) =>
    arr.some(item => item.x === x && item.y === y) ? true : false;

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

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    };
  }

  makeCells = () => {
    let cells = [];
    let color = `white`;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        cells.push({ x, y, color });
      }
    }
    return cells;
  };

  check_neighbours() {
    let answers_arr = this.user.selected_answers;
    let val_cell = "1";
    let val_cell_arr = [];

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

    answers_arr.forEach(element => {
      if (this.check_exists(element.y, element.x, this.tresures)) {
        val_cell = "T";
      } else {
        for (let i = 0; i < diagonal_neighbors.length; i++) {
          let x1 = element.x + diagonal_neighbors[i].x_n;
          let y1 = element.y + diagonal_neighbors[i].y_n;

          if (this.check_exists(y1, x1, this.tresures)) {
            val_cell = "2";
            break;
          }
        }
        for (let i = 0; i < side_neighbors.length; i++) {
          let x1 = element.x + side_neighbors[i].x_n;
          let y1 = element.y + side_neighbors[i].y_n;
          if (this.check_exists(y1, x1, this.tresures)) {
            val_cell = "3";
            break;
          }
        }
      }
      val_cell_arr.push(val_cell);
    });
    console.log(val_cell_arr);
    return val_cell_arr;
  }

  changeCells = user_cells_values => {
    let user_answers = this.user.selected_answers;
    let cells_values = this.state.cells;
    console.log(user_cells_values);

    user_answers.forEach(item => {
      let i = 0;
      const objIndex = cells_values.findIndex(
        obj => obj.y === item.y && obj.x === item.x
      );

      if (user_cells_values[i].includes(`T`)) {
        cells_values[objIndex].color = `#ee6c75`;
        cells_values[objIndex].value = `T`;
      }
      if (user_cells_values[i].includes(`3`)) {
        cells_values[objIndex].color = `#ddc1cc`;
        cells_values[objIndex].value = `3`;
      }
      if (user_cells_values[i].includes(`2`)) {
        cells_values[objIndex].color = `#e4f1e7`;
        cells_values[objIndex].value = `2`;
      }
      if (user_cells_values[i].includes(`1`)) {
        cells_values[objIndex].color = `#e1eafb`;
        cells_values[objIndex].value = `1`;
      }
      i++;
      console.log(cells_values[objIndex].value);
    });

    return cells_values;
  };

  handleClick = event => {
    const elemOffset = this.getElementOffset();

    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);
    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.user.selected_answers.push({ y, x });
    }

    if (this.count === 2) {
      let user_cell_values = this.check_neighbours();

      this.setState({
        cells: this.changeCells(user_cell_values)
      });

      this.count = 0;
      this.user.selected_answers = [];
    } else this.count++;
  };

  /*runIteration() {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          let neighbors = this.calculateNeighbors(this.board, x, y);
          if (this.board[y][x]) {
            if (neighbors === 2 || neighbors === 3) {
              newBoard[y][x] = true;
            } else {
              newBoard[y][x] = false;
            }
          } else {
            if (!this.board[y][x] && neighbors === 3) {
              newBoard[y][x] = true;
            }
          }
        }
      }
    }*/

  runGame = () => {
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells() });
    this.user = {
      board: this.board,
      selected_answers: []
    };
    //this.runIteration();
  };

  stopGame = () => {
    this.setState({ isRunning: false });
  };

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board
   * @param {int} x
   * @param {int} y
   */

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
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                pointerEvents: isRunning ? `` : `none`
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
                    value={cell.value}
                    isRunning={this.state.isRunning}
                    key={`${cell.x},${cell.y}`}
                  />
                );
              })}
            </div>

            <div className="controls">
              {isRunning ? (
                "Find 3 items of treasures in 10 trials!"
              ) : (
                <div>
                  <p>Your Score</p>
                  <h3>{this.score}</h3>
                  <p>points</p>

                  <button className="button" onClick={this.runGame}>
                    Run
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
