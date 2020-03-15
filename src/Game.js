import React from "react";
import "./Game.css";
import Login from "./Login";
import Cell, { CELL_SIZE, HEIGHT, WIDTH } from "./Cell";
import axios from "axios";

const db = require("./database");

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
    this.tresures = [];
    this.user = null;
    this.count = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runGame = this.runGame.bind(this);
    this.newUser = this.newUser.bind(this);
    this.fetch_user_results = this.fetch_user_results.bind(this);
  }

  state = {
    cells: [],
    isRunning: false,
    name: "",
    isEnabled: false,
    isGameStart: false,
    isGamFinished: false,
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

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  generateTresures = () => {
    let array_tresures = [];
    let i = 0;
    while (i < 3) {
      let x = this.getRandomInt(5);
      let y = this.getRandomInt(5);
      if (this.check_exists(y, x, array_tresures)) continue;
      this.board[y][x] = true;
      array_tresures.push({ y, x });
      i++;
    }
    return array_tresures;
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
    this.user.countTresure = 0;
    let cells = [];
    let color = `#554562`;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        cells.push({ x: x, y: y, color: color, value: "", isEnabled: true });
      }
    }
    db.treasureMap = cells;
    return cells;
  };

  check_neighbours = () => {
    let answers_arr = this.user.selected_answers;
    let val_cell = `1`;
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
        val_cell = `T`;
        this.user.countTresure++;
      } else {
        for (let i = 0; i < diagonal_neighbors.length; i++) {
          let x1 = element.x + diagonal_neighbors[i].x_n;
          let y1 = element.y + diagonal_neighbors[i].y_n;

          if (this.check_exists(y1, x1, this.tresures)) {
            val_cell = `2`;
            break;
          }
        }
        for (let i = 0; i < side_neighbors.length; i++) {
          let x1 = element.x + side_neighbors[i].x_n;
          let y1 = element.y + side_neighbors[i].y_n;
          if (this.check_exists(y1, x1, this.tresures)) {
            val_cell = `3`;
            break;
          }
        }
      }
      val_cell_arr.push(val_cell);
    });

    return val_cell_arr;
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

    this.runMove(x, y);

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

      let user_cell_values = this.check_neighbours();
      db.tresureMap = this.changeCells(user_cell_values, this.user.score);

      this.setState({
        cells: db.tresureMap
      });

      if (this.user.score === 8 || this.user.countTresure === 3) {
        this.user.results.push(this.user.score);

        this.setState({
          cells: this.state.cells.map(cell => (cell.isEnabled = false))
        });
        this.setState({ isRunning: false });
      }

      this.count = 0;
      this.user.selected_answers = [];
    }
  };

  fetch_user_results = async () => {
    let user_results;
    const response = await axios.get(`localhost:3005/user/${this.user.name}`);
    console.log(response.data);
    return user_results;
  };

  runGame = () => {
    this.user = {
      name: this.state.name,
      board: this.board,
      selected_answers: [],
      countTresure: 0,
      results: [],
      score: 0
    };

    this.setState({ isGameStart: true });
    console.log(this.user.name);
  };

  runCall = () => {
    this.tresures = this.generateTresures();
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells() });
    db.get_treasureMap = this.state.cells;

    this.count = 0;
    this.user.countTresure = 0;
    this.user.score = 0;
    this.user.results = this.fetch_user_results();
  };

  runMove = (user_position_x, user_postion_y) => {
    axios
      .post(`http://localhost:3005/user/move`, {
        name: this.user.name,
        movements: { user_position_x, user_postion_y }
      })
      .then(res => res.send("Movements added"));
  };

  stopGame = () => {
    this.setState({ isRunning: false });
  };

  clear_board = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ cells: this.makeCells() });
  };

  newUser = newValue => {
    this.setState({ name: newValue });
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
      isGamFinished,
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
              {isGamFinished ? (
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
