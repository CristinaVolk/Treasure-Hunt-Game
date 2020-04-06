import React from 'react'
import './Game.css'
import { Login } from './Login'
import { Cell, CELL_SIZE, HEIGHT, WIDTH } from './Cell'
import { ResultScore } from './ResultScore'
import { ButtonRunGame } from './ButtonRunGame'
import { ButtonRunSet } from './ButtonRunSet'
import { db } from '../server/database'
import { gameLogic } from '../server/game_logic'
import { core } from './core'
import { gameQueries } from './gameQueries'

const MAX_MOVES = 8
const MAX_TREASURES = 3
const MAX_CLICKS = 3

class Game extends React.Component {
  constructor() {
    super()
    this.rows = HEIGHT / CELL_SIZE
    this.cols = WIDTH / CELL_SIZE
    this.board = core.makeEmptyBoard()
    this.user = null
    this.treasureMap = db.generateTreasureMap()
    this.treasures = gameLogic.generateTreasures()

    this.newUser = this.newUser.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.runGame = this.runGame.bind(this)
    this.runMove = this.runMove.bind(this)
    this.runSet = this.runSet.bind(this)
    this.displayResult = this.displayResult.bind(this)
  }

  state = {
    cells: [],
    isRunning: false,
    name: '',
    isEnabled: false,
    isGameStart: false,
    isGameFinished: false,
    isUser: false,
  }

  handleSubmit = async () => {
    if (this.state.name.length === 0) alert('You should provide your name')
    else {
      const responseStatus = await gameQueries.createUser(this.state.name)
      console.log(responseStatus)

      if (responseStatus === 201) this.setState({ isUser: true })
      else this.setState({ isUser: false })
    }
  }

  newUser = (newValue) => this.setState({ name: newValue })

  makeTreasures = () => {
    for (let positionY = 0; positionY < this.rows; positionY += 1) {
      for (let positionX = 0; positionX < this.cols; positionX += 1) {
        if (
          this.treasures.find(
            (treasureItem) =>
              treasureItem.positionX === positionX &&
              treasureItem.positionY === positionY
          )
        )
          this.board[positionX][positionY] = true
        this.board[positionX][positionY] = false
      }
    }
  }

  makeCells = (isEnabled) => {
    this.user.countTreasure = 0
    const cells = []
    const color = '#554562'

    for (let positionX = 0; positionX < this.rows; positionX += 1) {
      for (let positionY = 0; positionY < this.cols; positionY += 1) {
        cells.push({
          positionX,
          positionY,
          color,
          value: '',
          isEnabled,
        })
      }
    }

    return cells
  }

  changeCells = (userCellsValues) => {
    const cellsValues = this.state.cells
    const userAnswers = this.user.movements

    let i = 0
    userAnswers.forEach((item) => {
      const objIndex = cellsValues.findIndex(
        (cell) =>
          cell.positionX === item.positionX && cell.positionY === item.positionY
      )

      if (userCellsValues[i].value.includes('T')) {
        cellsValues[objIndex].color = '#ee6c75'
        cellsValues[objIndex].value = 'T'
        cellsValues[objIndex].isEnabled = false
      } else if (userCellsValues[i].value.includes('3')) {
        cellsValues[objIndex].color = '#ddc1cc'
        cellsValues[objIndex].value = '3'
        cellsValues[objIndex].isEnabled = false
      } else if (userCellsValues[i].value.includes('2')) {
        cellsValues[objIndex].color = '#e4f1e7'
        cellsValues[objIndex].value = '2'
        cellsValues[objIndex].isEnabled = false
      } else if (userCellsValues[i].value.includes('1')) {
        cellsValues[objIndex].color = '#e1eafb'
        cellsValues[objIndex].value = '1'
        cellsValues[objIndex].isEnabled = false
      }
      i += 1
    })

    return cellsValues
  }

  checkIfCellWasClicked = (pointOnMap) => {
    const objIndex = this.state.cells.findIndex(
      (obj) =>
        obj.positionX === pointOnMap.positionX &&
        obj.positionY === pointOnMap.positionY
    )

    if (this.state.cells[objIndex].isEnabled === false) {
      this.user.countClicks -= 1
      return true
    }
    return false
  }

  updateCells = () => {
    const selectedCellsAssighed = gameLogic.checkNeighbours(
      this.user.movements,
      this.treasures
    )

    selectedCellsAssighed.forEach((answer) => {
      if (answer.value === 'T') this.user.countTreasure += 1
    })

    if (this.user.countTreasure >= MAX_TREASURES) {
      this.setState({ isRunning: false })
      this.updateScores()
      this.displayResult()
      this.treasures = []
    }

    const updatedCells = this.changeCells(selectedCellsAssighed, this.user.score)

    this.setState({
      cells: updatedCells,
    })
  }

  handleClick = (event) => {
    this.user.countClicks += 1
    const elemOffset = core.getElementOffset(this.boardRef)
    const pointOnMap = core.obtainCoordinatesFromClick(event, elemOffset)

    if (this.checkIfCellWasClicked(pointOnMap)) return

    if (
      pointOnMap.positionX >= 0 &&
      pointOnMap.positionX <= this.cols &&
      pointOnMap.positionY >= 0 &&
      pointOnMap.positionY <= this.rows
    ) {
      this.user.movements.push(pointOnMap)
    }

    if (this.user.countClicks === MAX_CLICKS) {
      this.runMove(this.user.movements)
      this.updateCells()

      if (this.user.score >= MAX_MOVES) {
        this.updateScores()
        this.setState({ isRunning: false })
      }
      this.endMove()
    }
  }

  runGame = () => {
    this.user = {
      name: this.state.name,
      board: this.board,
      movements: [],
      countTreasure: 0,
      score: 0,
      countSets: 0,
      countClicks: 0,
      topResults: [],
      ...this.user,
    }

    this.setState({ isGameFinished: false })
    this.setState({ isUser: true })
    this.setState({ isGameStart: true })
  }

  runSet = () => {
    if (this.user.countSets >= 3) {
      this.displayResult()
      this.setState({ isGameFinished: true })
      this.stopGame()
    }
    this.board = core.makeEmptyBoard()
    this.treasures = gameLogic.generateTreasures()
    this.user.countTreasure = 0
    this.user.score = 1
    this.user.countSets += 1
    this.setState({ isRunning: true })
    this.setState({ cells: this.makeCells(true) })
  }

  runMove = async (movements) => {
    this.setState({ isRunning: true })
    const config = {
      name: this.user.name,
      movements,
      treasureMap: this.treasureMap,
      treasures: this.treasures,
    }

    const response = await gameQueries.makeUserMove(config)
    console.log(response.status)
    if (response.status === 200) this.user.score += 1
  }

  endMove = () => {
    this.user.countClicks = 0
    this.user.movements = []
  }

  stopGame = () => {
    core.makeEmptyBoard()
    this.setState({ cells: this.makeCells(false) })
    this.setState({ isRunning: false })
    this.setState({ isGameStart: false })
  }

  updateScores = async () => {
    const responseStatus = await gameQueries.updateUserScore(
      this.user.name,
      this.user.score
    )
    console.log(responseStatus)
  }

  displayResult = async () => {
    const userScore = await gameQueries.fetchScore(this.user.name)
    console.log(userScore)
    if (userScore.length) this.user.topResults = userScore
  }

  render() {
    const {
      cells,
      isRunning,
      name,
      isGameStart,
      isGameFinished,
      isUser,
    } = this.state

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
                this.boardRef = n
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
                )
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
    )
  }
}

export default Game
