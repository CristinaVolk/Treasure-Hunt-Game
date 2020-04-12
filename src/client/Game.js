/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import './Game.css';
import { Login } from './Login';
import { Cell, CELL_SIZE, HEIGHT, WIDTH } from './Cell';
import { ResultScore } from './ResultScore';
import { ButtonRunGame } from './ButtonRunGame';
import { ButtonRunSet } from './ButtonRunSet';

import {
  makeEmptyBoard,
  getElementOffset,
  obtainCoordinatesFromClick,
  enableTreasureMapBoard,
} from './core';
import { gameQueries } from './gameQueries';

const MAX_CLICKS = 3;

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = makeEmptyBoard();
    this.user = {};

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
    error: '',
    messageForUser: '',
    topResults: [],
  };

  handleSubmit = async () => {
    if (this.state.name.length === 0)
      this.setState({ error: 'You should provide your name' });
    else {
      const newUser = await gameQueries.createUser(this.state.name);

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
    const elemOffset = getElementOffset(this.boardRef);
    const pointOnMap = obtainCoordinatesFromClick(event, elemOffset);

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
      this.runMove();

      this.endMove();
    }
  };

  runGame = () => {
    this.user = {
      name: this.state.name,
      treasureMap: this.state.cells,
      movements: [],
      countSets: 0,
      countClicks: 0,
      topResults: [],
      ...this.user,
    };

    this.setState({ isGameFinished: false });
    this.setState({ isUser: true });
    this.setState({ isGameStart: true });
  };

  runSet = () => {
    this.setState({ cells: enableTreasureMapBoard(this.user.treasureMap) });
    if (this.user.countSets === 3) {
      this.displayResult();
      this.stopGame();
    }
    this.user.countSets += 1;
    this.setState({ isRunning: true });
  };

  runMove = async () => {
    this.setState({ isRunning: true });
    const config = {
      name: this.user.name,
      movements: this.user.movements,
    };

    const response = await gameQueries.makeUserMove(config);
    if (response) {
      if (response.data.countMoves === 8) {
        this.setState({ isRunning: false });
        this.setState({
          messageForUser: 'You have not found all of the treasures...Try again',
        });
      }
      if (response.data.countTreasures === 3) {
        this.setState({ isRunning: false });
        this.setState({
          messageForUser: 'Congrats! You have found all of the treasures!',
        });
      }
      console.log(response.data);
      this.user.treasureMap = response.data.treasureMap;
      this.setState({ cells: response.data.treasureMap });
    }
  };

  endMove = () => {
    this.user.countClicks = 0;
    this.user.movements = [];
  };

  stopGame = () => {
    makeEmptyBoard();
    this.setState({ isGameFinished: true });
    this.setState({ isRunning: false });
    this.setState({ isGameStart: false });
  };

  displayResult = async () => {
    const userScore = await gameQueries.fetchScore(this.user.name);
    if (userScore.length) this.setState({ topResults: userScore });
  };

  render() {
    const {
      cells,
      isRunning,
      name,
      isGameStart,
      isGameFinished,
      isUser,
      error,
      messageForUser,
      topResults,
    } = this.state;

    return (
      <div>
        {!isUser ? (
          <React.Fragment>
            <Login
              onUser={this.newUser}
              onHandleSubmit={this.handleSubmit}
              name={name}
            />
            <span>{error}</span>
          </React.Fragment>
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
                    isRevealed={cell.isRevealed}
                    key={`${cell.positionX},${cell.positionY}`}
                  />
                );
              })}
            </div>

            <div className="controls">
              {isGameFinished && <ResultScore topResults={topResults} />}

              {!isGameStart && !isRunning && (
                <ButtonRunGame runGame={this.runGame} />
              )}

              {!isRunning && isGameStart ? (
                <React.Fragment>
                  <ButtonRunSet runSet={this.runSet} />
                  <h3>{messageForUser}</h3>
                </React.Fragment>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
