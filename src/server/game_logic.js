const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const generateTreasures = () => {
  const treasures = []
  let i = 0
  while (i < 3) {
    const positionX = getRandomInt(5)
    const positionY = getRandomInt(5)
    if ( checkTreasureContained( positionX, positionY, treasures ) ) continue

    treasures.push({ positionX, positionY })
    i+=1
  }
  return treasures
}

const checkTreasureContained = (positionX, positionY, mapArray) => {
  return mapArray.find(
    (item) => item.positionX === positionX && item.positionY === positionY
  )
}

const checkNeighbours = (movements, treasures) => {
  let cellValue = '1'
  const movementsAsignedValues = []

  const diagonalNeighbors = [
    { stepDiagonalX: -1, stepDiagonalY: -1 },
    { stepDiagonalX: -1, stepDiagonalY: 1 },
    { stepDiagonalX: 1, stepDiagonalY: 1 },
    { stepDiagonalX: 1, stepDiagonalY: -1 },
  ]

  const sideNeighbors = [
    { stepSideX: 0, stepSideY: -1 },
    { stepSideX: 1, stepSideY: 0 },
    { stepSideX: 0, stepSideY: 1 },
    { stepSideX: -1, stepSideY: 0 },
  ]

  movements.forEach((movement) => {
    if (checkTreasureContained(movement.positionX, movement.positionY, treasures)) {
      cellValue = 'T'
    } else {
      for (let i = 0; i < diagonalNeighbors.length; i+=1) {
        const positionXDiagonalNeighbour =
          movement.positionX + diagonalNeighbors[i].stepDiagonalX
        const positionYDiagonalNeighbour =
          movement.positionY + diagonalNeighbors[i].stepDiagonalY

        if (
          checkTreasureContained(
            positionXDiagonalNeighbour,
            positionYDiagonalNeighbour,
            treasures
          )
        ) {
          cellValue = '2'
          break
        }
      }
      for (let i = 0; i < sideNeighbors.length; i+=1) {
        const positionXSideNeighbour = movement.positionX + sideNeighbors[i].stepSideX
        const positionYSideNeighbour = movement.positionY + sideNeighbors[i].stepSideY
        if (
          checkTreasureContained(positionXSideNeighbour, positionYSideNeighbour, treasures)
        ) {
          cellValue = '3'
          break
        }
      }
    }

    movementsAsignedValues.push({
      positionX: movement.positionX,
      positionY: movement.positionY,
      value: cellValue,
    })
  })
  return movementsAsignedValues
}

export const gameLogic = {
  checkTreasureContained,
  checkNeighbours,
  generateTreasures,
}
