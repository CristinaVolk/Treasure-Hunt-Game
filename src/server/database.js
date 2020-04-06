import { gameLogic } from './game_logic'

const COLLS = 5
const ROWS = 5
const SCORE_LIMIT = 10

const users = []

function generateTreasureMap() {
  const treasureMap = []
  for (let positionX = 0; positionX < ROWS; positionX+=1) {
    for (let positionY = 0; positionY < COLLS; positionY+=1) {
      treasureMap.push({
        positionX,
        positionY,
        value: '',
      })
    }
  }
  return treasureMap
}

const getUserScore = (userName) => {
  const user = findUserByName(userName)
  return user ? user.scores : []
}

const getBestScores = (userName) => {
  let topResults
  const foundUser = findUserByName(userName)
  if (foundUser) {
    topResults = foundUser.scores.sort((a, b) => a > b).slice(0, SCORE_LIMIT)
  }
  return topResults
}

const addUser = (name) => users.push({ name, scores: [], movements: [] })

const findUserByName = (name) => users.find((user) => user.name === name)

const makeMove = (config) => {
  const currentUserIndex = users.findIndex((user) => user.name === config.name)

  const movementsAsignedValues = gameLogic.check_neighbours(
    config.movements,
    config.treasures
  )

  if (currentUserIndex !== -1) {
    movementsAsignedValues.forEach((movement) => {
      users[currentUserIndex].movements.push(movement)
    })

    movementsAsignedValues.map((field) => {
      const mapFieldIndex = config.treasureMap.findIndex((mapField) => {
        return (
          mapField.positionX === field.positionX &&
          mapField.positionY === field.positionY
        )
      })
      config.treasureMap[mapFieldIndex].value = field.value
    })
  }

  return movementsAsignedValues
}

export const db = {
  getBestScores,
  makeMove,
  findUserByName,
  getUserScore,
  generateTreasureMap,
  addUser,
}
