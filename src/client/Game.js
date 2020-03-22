import React from "react";
import "./Game.css";
import Login from "./Login";
import Cell, { CELL_SIZE, HEIGHT, WIDTH } from "./Cell";

const axios = require("axios");
const db = require("../server/database");
const gameLogic = require("../server/game_logic");
const core = require("./core");

const MAX_MOVES = 8;
const MAX_TREASURES = 3;
const MAX_CLICKS = 3;

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = core.makeEmptyBoard();
    this.user = null;
    this.treasureMap = db.generateTreasureMap();
    this.treasures = gameLogic.generateTreasures();

    this.newUser = this.newUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runGame = this.runGame.bind(this);
    this.runMove = this.runMove.bind(this);
    this.runSet = this.runSet.bind(this);
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

  makeTreasures = () => {
    for (let positionY = 0; positionY < this.rows; positionY++) {
      for (let positionX = 0; positionX < this.cols; positionX++) {
        if (
          this.treasures.find(
            treasureItem =>
              treasureItem.positionX === positionX &&
              treasureItem.positionY === positionY
          )
        )
          this.board[positionX][positionY] = true;
        this.board[positionX][positionY] = false;
      }
    }
  };

  makeCells = isEnabled => {
    this.user.countTreasure = 0;
    let cells = [];
    let color = `#554562`;

    for (let positionX = 0; positionX < this.rows; positionX++) {
      for (let positionY = 0; positionY < this.cols; positionY++) {
        cells.push({
          positionX: positionX,
          positionY: positionY,
          color: color,
          value: "",
          isEnabled: isEnabled
        });
      }
    }

    return cells;
  };

  changeCells = user_cells_values => {
    let cells_values = this.state.cells;
    let user_answers = this.user.movements;

    let i = 0;
    user_answers.forEach(item => {
      const objIndex = cells_values.findIndex(
        cell =>
          cell.positionX === item.positionX && cell.positionY === item.positionY
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

  checkIfCellWasClicked = pointOnMap => {
    const objIndex = this.state.cells.findIndex(
      obj =>
        obj.positionX === pointOnMap.positionX &&
        obj.positionY === pointOnMap.positionY
    );

    if (this.state.cells[objIndex].isEnabled === false) {
      this.user.countClicks--;
      return true;
    }
    return false;
  };

  updateCells = () => {
    let selectedCellsAssighed = gameLogic.check_neighbours(
      this.user.movements,
      this.treasures
    );

    selectedCellsAssighed.forEach(answer => {
      if (answer.value === `T`) this.user.countTreasure++;
    });

    if (this.user.countTreasure >= MAX_TREASURES) {
      this.updateScores();
      this.setState({ isRunning: false });
      this.displayResult();
      this.treasures = [];
    }

    const updatedCells = this.changeCells(
      selectedCellsAssighed,
      this.user.score
    );

    this.setState({
      cells: updatedCells
    });
  };

  updateScores = () => {
    axios
      .put(`http://localhost:3005/user/score`, {
        name: this.user.name,
        score: this.user.score
      })
      .then(response => console.log(response, "Score added!"));
  };

  handleClick = event => {
    this.user.countClicks++;
    const elemOffset = core.getElementOffset(this.boardRef);
    const pointOnMap = core.obtainCoordinatesFromClick(event, elemOffset);

    if (this.checkIfCellWasClicked(pointOnMap)) return;

    if (
      pointOnMap.positionX >= 0 &&
      pointOnMap.positionX <= this.cols &&
      pointOnMap.positionY >= 0 &&
      pointOnMap.positionY <= this.rows
    ) {
      this.user.movements.push(pointOnMap);
    }

    if (this.user.countClicks === MAX_CLICKS) {
      this.user.score++;
      this.runMove(this.user.movements);
      this.updateCells();

      if (this.user.score === MAX_MOVES) {
        this.updateScores();
        this.setState({ cells: this.makeCells(false) });
        this.setState({ isRunning: false });
      }

      this.endMove();
    }
  };

  runGame = () => {
    this.user = {
      name: this.state.name,
      board: this.board,
      movements: [],
      countTreasure: 0,
      score: 0,
      countSets: 0,
      countClicks: 0
    };
    this.setState({ isUser: true });
    this.setState({ isGameStart: true });
  };

  runSet = () => {
    this.board = core.makeEmptyBoard();
    this.treasures = gameLogic.generateTreasures();
    this.user.countTreasure = 0;
    this.user.score = 0;
    this.user.countSets++;
    this.setState({ isRunning: true });
    this.setState({ cells: this.makeCells(true) });
  };

  runMove = movements => {
    axios
      .post(`http://localhost:3005/user/move`, {
        name: this.user.name,
        movements: movements,
        treasureMap: this.treasureMap,
        treasures: this.treasures
      })
      .then(response => console.log(response, "Movements added!"));
  };

  endMove = () => {
    this.user.countClicks = 0;
    this.user.movements = [];
    if (this.user.countSets === 10) this.setState({ isGameFinished: true });
  };

  stopGame = () => {
    this.setState({ isRunning: false });
    this.setState({ isGameStart: false });
  };

  displayResult = () => {
    const results = axios
      .get(`http://localhost:3005/scores/top/${this.user.name}`)
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
                    positionX={cell.positionX}
                    positionY={cell.positionY}
                    color={cell.color}
                    value={cell.value}
                    isEnabled={cell.isEnabled}
                    key={`${cell.positionX},${cell.positionY}`}
                  />
                );
              })}
            </div>

            <div className="controls">
              {isGameFinished ? (
                <div>
                  Your score
                  {this.displayResult.map((result, index) => {
                    return <p key={index}>{result}</p>;
                  })}
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
                  onClick={this.runSet}
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
