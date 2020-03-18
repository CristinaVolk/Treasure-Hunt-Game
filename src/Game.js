import React from "react";
import "./Game.css";
import Login from "./Login";
import Cell, { CELL_SIZE, HEIGHT, WIDTH } from "./Cell";

const axios = require("axios");
const db = require("./database");
const gameLogic = require("./game_logic");

const MAX_MOVE = 8;
const MAX_TREASURES = 3;
const MAX_CLICKS = 3;

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
    this.user = null;
    this.treasureMap = db.generateTreasureMap();
    this.TREASURES = gameLogic.generateTreasures();
    this.count = 0;

    this.newUser = this.newUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runGame = this.runGame.bind(this);
    this.runMove = this.runMove.bind(this);
    this.runCall = this.runCall.bind(this);
    this.endMove = this.endMove.bind(this);
    this.stopGame = this.stopGame.bind(this);
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

  handleSubmit = async () => {
    if (this.state.name.length === 0) alert("You should provide your name");
    else {
      try {
        let response = await axios.post("http://localhost:3005/user", {
          name: this.state.name
        });
        let res_status = await response.status;

        res_status === 201
          ? this.setState({ isUser: true })
          : this.setState({ isUser: false });
      } catch (error) {
        console.error(error);
      }
    }
  };

  newUser = newValue => {
    this.setState({ name: newValue });
  };

  makeEmptyBoard() {
    let board = [];
    for (let x = 0; x < this.rows; x++) {
      board[x] = [];
      for (let y = 0; y < this.cols; y++) {
        board[x][y] = false;
      }
    }

    return board;
  }

  check_exists = (y, x, array_to_check) =>
    array_to_check.some(item => item.x === x && item.y === y) ? true : false;

  makeTreasures = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.TREASURES.find(item => item.x === x && item.y === y))
          this.board[x][y] = true;

        this.board[x][y] = false;
      }
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

    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        cells.push({ x: x, y: y, color: color, value: "", isEnabled: true });
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
        cell => cell.y === item.x && cell.x === item.y
      );

      if (user_cells_values[i].value.includes(`T`)) {
        cells_values[objIndex].color = `#ee6c75`;
        cells_values[objIndex].value = `T`;
        cells_values[objIndex].isEnabled = false;
      } else if (user_cells_values[i].value.includes(`3`)) {
        cells_values[objIndex].color = `#ddc1cc`;
        cells_values[objIndex].value = `3`;
        cells_values[objIndex].isEnabled = false;
      } else if (user_cells_values[i].value.includes(`2`)) {
        cells_values[objIndex].color = `#e4f1e7`;
        cells_values[objIndex].value = `2`;
        cells_values[objIndex].isEnabled = false;
      } else if (user_cells_values[i].value.includes(`1`)) {
        cells_values[objIndex].color = `#e1eafb`;
        cells_values[objIndex].value = `1`;
        cells_values[objIndex].isEnabled = false;
      }
      i++;
    });

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

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.user.selected_answers.push({ x, y });
    }

    if (this.count === MAX_CLICKS) {
      this.user.score++;

      this.runMove(this.user.selected_answers);

      this.setState({ isUser: true });

      let answers_to_show = gameLogic.check_neighbours(
        this.user.selected_answers,
        this.TREASURES
      );

      answers_to_show.map(answer => {
        if (answer.value === `T`) this.user.countTreasure++;
        console.log(this.user.countTreasure);
      });

      const updated_cells = this.changeCells(answers_to_show, this.user.score);

      this.setState({
        cells: updated_cells
      });

      if (
        this.user.score === MAX_MOVE ||
        this.user.countTreasure === MAX_TREASURES
      ) {
        this.user.results.push(this.user.score);
        let user_scores = db.getUserScore(this.user.name);
        user_scores.push(this.user.score);

        this.setState({
          cells: this.state.cells.map(cell => (cell.isEnabled = false))
        });
        this.setState({ isRunning: false });
      }

      this.endMove();
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
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells() });
    this.user.countTreasure = 0;
    this.user.score = 0;
  };

  runMove = movements => {
    axios
      .post(`http://localhost:3005/user/move`, {
        name: this.user.name,
        movements: movements,
        treasureMap: this.treasureMap,
        TREASURES: this.TREASURES
      })
      .then(response => console.log(response, "Movements added!"));
  };

  endMove = () => {
    this.count = 0;
    this.user.selected_answers = [];
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
                  {this.user.results.map((result, index = 0) => (
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
