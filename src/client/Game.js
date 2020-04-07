/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import './Game.css';
import { Login } from './Login';
import { Cell, CELL_SIZE, HEIGHT, WIDTH } from './Cell';
import { ResultScore } from './ResultScore';
import { ButtonRunGame } from './ButtonRunGame';
import { ButtonRunSet } from './ButtonRunSet';

import { core } from './core';
import { gameQueries } from './gameQueries';

const gameLogic = require('../server/gameLogic');

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

    this.newUser = this.newUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.runGame = this.runGame.bind(this);
    this.runMove = this.runMove.bind(this);
    this.runSet = this.runSet.bind(this);
    this.displayResult = this.displayResult.bind(this);
  }

  state = {
    cells: [],
    isRunning: false,
    name: '',
    isEnabled: false,
    isGameStart: false,
    isGameFinished: false,
    isUser: false,
  };

  handleSubmit = async () => {
    if (this.state.name.length === 0) alert('You should provide your name');
    else {
      const newUser = await gameQueries.createUser(this.state.name);
      console.log(newUser);

      if (newUser) {
        this.setState({ isUser: true });
        this.setState({ cells: newUser.treasureMap });
      } else this.setState({ isUser: false });
    }
  };

  newUser = (newValue) => this.setState({ name: newValue });

  checkIfCellWasClicked = (pointOnMap) => {
    const objIndex = this.state.cells.findIndex(
      (obj) =>
        obj.positionX === pointOnMap.positionX &&
        obj.positionY === pointOnMap.positionY
    );

    if (this.state.cells[objIndex].isEnabled === false) {
      this.user.countClicks -= 1;
      return true;
    }
    return false;
  };

  handleClick = (event) => {
    this.user.countClicks += 1;
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
      console.log('movements', this.user.movements);
      this.runMove();
      this.endMove();
    }
  };

  runGame = () => {
    this.user = {
      name: this.state.name,
      board: this.board,
      movements: [],
      countSets: 0,
      countClicks: 0,
      countMoves: 0,
      topResults: [],
      ...this.user,
    };

    this.setState({ isGameFinished: false });
    this.setState({ isUser: true });
    this.setState({ isGameStart: true });
  };

  runSet = () => {
    if (this.user.countSets >= 3) {
      this.displayResult();
      this.setState({ isGameFinished: true });
      this.stopGame();
    }
    this.user.countTreasure = 0;
    this.user.countSets += 1;
    this.setState({ isRunning: true });
    // this.setState({ cells: this.makeCells(true) });
  };

  runMove = async () => {
    this.user.countMoves += 1;
    this.setState({ isRunning: true });
    const config = {
      name: this.user.name,
      movements: this.user.movements,
    };

    const response = await gameQueries.makeUserMove(config);
    console.log(response);
    if (response) {
      this.setState({ cells: response.data.treasureMap });
      if (response.data.countTreasures === 3 || response.data.countMoves === 8) {
        this.setState({ isRunning: false });
      }
    }
  };

  endMove = () => {
    this.user.countClicks = 0;
    this.user.movements = [];
  };

  stopGame = () => {
    core.makeEmptyBoard();
    this.setState({ isRunning: false });
    this.setState({ isGameStart: false });
  };

  updateScores = async () => {
    const responseStatus = await gameQueries.updateUserScore(
      this.user.name,
      this.user.score
    );
    console.log(responseStatus);
  };

  displayResult = async () => {
    const userScore = await gameQueries.fetchScore(this.user.name);
    console.log(userScore);
    if (userScore.length) this.user.topResults = userScore;
  };

  render() {
    const {
      cells,
      isRunning,
      name,
      isGameStart,
      isGameFinished,
      isUser,
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
                pointerEvents: 'none',
              }}
              onClick={this.handleClick}
              ref={(n) => {
                this.boardRef = n;
              }}
            >
              {cells.map((cell) => {
                return (
                  <Cell
                    positionX={cell.positionX}
                    positionY={cell.positionY}
                    color={cell.color}
                    value={cell.value}
                    isEnabled={isRunning}
                    key={`${cell.positionX},${cell.positionY}`}
                  />
                );
              })}
            </div>

            <div className="controls">
              {isGameFinished && <ResultScore topResults={this.user.topResults} />}

              {!isGameStart && !isRunning && (
                <ButtonRunGame runGame={this.runGame} />
              )}

              {!isRunning && isGameStart && <ButtonRunSet runSet={this.runSet} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
