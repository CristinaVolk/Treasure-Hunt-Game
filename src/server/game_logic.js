const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

const generateTreasures = () => {
  let treasures = [];
  let i = 0;
  while (i < 3) {
    let positionX = getRandomInt(5);
    let positionY = getRandomInt(5);
    if (check_exists(positionX, positionY, treasures)) continue;

    treasures.push({ positionX, positionY });
    i++;
  }
  return treasures;
};

const check_exists = (positionX, positionY, map_array) => {
  return map_array.find(
    item => item.positionX === positionX && item.positionY === positionY
  );
};

const check_neighbours = (movements, treasures) => {
  let cellValue = `1`;
  let movementsAsignedValues = [];

  let diagonal_neighbors = [
    { stepDiagonalX: -1, stepDiagonalY: -1 },
    { stepDiagonalX: -1, stepDiagonalY: 1 },
    { stepDiagonalX: 1, stepDiagonalY: 1 },
    { stepDiagonalX: 1, stepDiagonalY: -1 }
  ];

  let side_neighbors = [
    { stepSideX: 0, stepSideY: -1 },
    { stepSideX: 1, stepSideY: 0 },
    { stepSideX: 0, stepSideY: 1 },
    { stepSideX: -1, stepSideY: 0 }
  ];

  movements.forEach(movement => {
    if (check_exists(movement.positionX, movement.positionY, treasures)) {
      cellValue = `T`;
    } else {
      for (let i = 0; i < diagonal_neighbors.length; i++) {
        let positionXDiagonalNeighbour =
          movement.positionX + diagonal_neighbors[i].stepDiagonalX;
        let positionYDiagonalNeighbour =
          movement.positionY + diagonal_neighbors[i].stepDiagonalY;

        if (
          check_exists(
            positionXDiagonalNeighbour,
            positionYDiagonalNeighbour,
            treasures
          )
        ) {
          cellValue = `2`;
          break;
        }
      }
      for (let i = 0; i < side_neighbors.length; i++) {
        let positionXSideNeighbour =
          movement.positionX + side_neighbors[i].stepSideX;
        let positionYSideNeighbour =
          movement.positionY + side_neighbors[i].stepSideY;
        if (
          check_exists(
            positionXSideNeighbour,
            positionYSideNeighbour,
            treasures
          )
        ) {
          cellValue = `3`;
          break;
        }
      }
    }

    movementsAsignedValues.push({
      positionX: movement.positionX,
      positionY: movement.positionY,
      value: cellValue
    });
  });
  return movementsAsignedValues;
};

module.exports = {
  check_exists,
  check_neighbours,
  generateTreasures
};
