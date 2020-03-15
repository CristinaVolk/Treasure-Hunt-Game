import React from "react";
import "./Game.css";
import Login from "./Login";
import Cell, { CELL_SIZE, HEIGHT, WIDTH } from "./Cell";
import axios from "axios";

const db = require("./database");
const gameLogic = require("./game_logic");

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
    this.treasures = [];
    this.user = null;
    this.count = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runGame = this.runGame.bind(this);
    this.newUser = this.newUser.bind(this);
  }

  state = {
    cells: [],
    isRunning: false,
    name: "",
    isEnabled: false,
    isGameStart: false,
    isGameFinished: false,
    topResults: null,
    isUser: false
  };

  makeEmptyBoard = () => {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  };

  check_exists = (y, x, arr) =>
    arr.some(item => item.x === x && item.y === y) ? true : false;

  makeTreasures = () => {
    treasures = gameLogic.TREASURES;
    let i = 0;
    while (i < 3) {
      this.board.map(cell => {
        if (treasures[i].y === cell.y && treasures[i].x === cell.x)
          this.board[y][x] = true;
        i++;
      });
    }
  };

  getElementOffset = () => {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    };
  };

  makeCells = () => {
    this.user.countTreasure = 0;
    let cells = [];
    let color = `#554562`;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        cells.push({ x: x, y: y, color: color, value: "", isEnabled: true });
        db.treasureMap.push({ y: y, x: x, value: "" });
      }
    }

    return cells;
  };

  changeCells = user_cells_values => {
    let cells_values = this.state.cells;

    let user_answers = this.user.selected_answers;

    let i = 0;
    user_answers.forEach(item => {
      const objIndex = cells_values.findIndex(
        obj => obj.y === item.y && obj.x === item.x
      );
      console.log(objIndex, user_cells_values[i]);

      if (user_cells_values[i].includes(`T`)) {
        cells_values[objIndex].color = `#ee6c75`;
        cells_values[objIndex].value = `T`;
        cells_values[objIndex].isEnabled = false;
      } else if (user_cells_values[i].includes(`3`)) {
        cells_values[objIndex].color = `#ddc1cc`;
        cells_values[objIndex].value = `3`;
        cells_values[objIndex].isEnabled = false;
      } else if (user_cells_values[i].includes(`2`)) {
        cells_values[objIndex].color = `#e4f1e7`;
        cells_values[objIndex].value = `2`;
        cells_values[objIndex].isEnabled = false;
      } else if (user_cells_values[i].includes(`1`)) {
        cells_values[objIndex].color = `#e1eafb`;
        cells_values[objIndex].value = `1`;
        cells_values[objIndex].isEnabled = false;
      }
      i++;
    });

    db.get_treasureMap = cells_values;

    return cells_values;
  };

  handleClick = event => {
    this.count++;

    console.log(this.count);
    const elemOffset = this.getElementOffset();

    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    const objIndex = this.state.cells.findIndex(
      obj => obj.y === y && obj.x === x
    );

    if (this.state.cells[objIndex].isEnabled === false) {
      this.count--;
      return;
    }
    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.user.selected_answers.push({ y, x });
    }

    if (this.count === 3) {
      this.user.score++;

      this.runMove(this.user.selected_answers);

      this.setState({ isUser: true });

      let user_cell_values = this.check_neighbours();
      const updated_cells = this.changeCells(user_cell_values, this.user.score);

      this.setState({
        cells: updated_cells
      });

      if (this.user.score === 8 || this.user.countTreasure === 3) {
        this.user.results.push(this.user.score);
        db.getUserScore(this.user.name).push(this.user.score);

        this.setState({
          cells: this.state.cells.map(cell => (cell.isEnabled = false))
        });
        this.setState({ isRunning: false });
      }

      this.count = 0;
      this.user.selected_answers = [];
    }
  };

  runGame = () => {
    this.user = {
      name: this.state.name,
      board: this.board,
      selected_answers: [],
      countTreasure: 0,
      results: [],
      score: 0
    };

    this.setState({ isGameStart: true });
  };

  runCall = () => {
    this.treasures = gameLogic.generateTreasures();
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells() });
    db.get_treasureMap = this.state.cells;

    this.count = 0;
    this.user.countTreasure = 0;
    this.user.score = 0;
    //this.user.results = db.getUserScore(this.user.name);
  };

  runMove = movements => {
    axios
      .post(`http://localhost:3005/user/move`, {
        name: this.user.name,
        movements: movements
      })
      .then(response => response.send("Movements added"));
  };

  handleSubmit = () => {
    if (this.state.name.length === 0) alert("You should provide your name");
    else {
      axios
        .post("http://localhost:3005/user", {
          name: this.state.name
        })
        .then(response => {
          console.log(response, "User added!");
        });
      this.setState({ isUser: true });
    }
  };
  newUser = newValue => {
    this.setState({ name: newValue });
  };

  stopGame = () => {
    this.setState({ isRunning: false });
  };
  clear_board = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ cells: this.makeCells() });
  };

  displayResult = () => {
    const results = axios
      .get(`localhost:3005/top/score`)
      .then(response => response.json())
      .then(topResults => this.setState(topResults));
    return results;
  };

  render() {
    const {
      cells,
      isRunning,
      name,
      isGameStart,
      isGameFinished,
      isUser
    } = this.state;

    return (
      <div>
        {!isUser ? (
          <Login
            onUser={this.newUser}
            onHandleSubmit={this.handleSubmit}
            name={name}
          />
        ) : (
          <div>
            <div
              className="Board"
              style={{
                width: WIDTH,
                height: HEIGHT,
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                pointerEvents: `none`
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
                    isEnabled={cell.isEnabled}
                    key={`${cell.x},${cell.y}`}
                  />
                );
              })}
            </div>

            <div className="controls">
              {isGameFinished ? (
                <div>
                  Your score
                  {this.displayResult.map((result, index) => (
                    <p key={index}>{result}</p>
                  ))}
                </div>
              ) : (
                ""
              )}
              {!isGameStart && !isRunning ? (
                <button
                  className="button"
                  onClick={this.runGame}
                  style={{ fontSize: `24px` }}
                >
                  Run Game
                </button>
              ) : (
                ""
              )}
              {!isRunning && isGameStart ? (
                <button
                  className="button"
                  onClick={this.runCall}
                  style={{ fontSize: `24px` }}
                >
                  <p>Press the button to run the Set</p>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
