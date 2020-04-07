/* eslint-disable @typescript-eslint/no-var-requires */

const checkTreasureContained = (positionX, positionY, mapArray) => {
  return mapArray.find(
    (item) => item.positionX === positionX && item.positionY === positionY
  );
};

const checkNeighbours = (movements, treasures) => {
  let cellValue = '1';
  let cellColor = '#99848c';
  const movementsAsignedValues = [];

  const diagonalNeighbors = [
    { stepDiagonalX: -1, stepDiagonalY: -1 },
    { stepDiagonalX: -1, stepDiagonalY: 1 },
    { stepDiagonalX: 1, stepDiagonalY: 1 },
    { stepDiagonalX: 1, stepDiagonalY: -1 },
  ];

  const sideNeighbors = [
    { stepSideX: 0, stepSideY: -1 },
    { stepSideX: 1, stepSideY: 0 },
    { stepSideX: 0, stepSideY: 1 },
    { stepSideX: -1, stepSideY: 0 },
  ];

  movements.forEach((movement) => {
    if (checkTreasureContained(movement.positionX, movement.positionY, treasures)) {
      checkTreasureContained(movement.positionX, movement.positionY, treasures);
      cellValue = 'T';
      cellColor = '#ee6c75';
    } else {
      for (let i = 0; i < diagonalNeighbors.length; i += 1) {
        const positionXDiagonalNeighbour =
          movement.positionX + diagonalNeighbors[i].stepDiagonalX;
        const positionYDiagonalNeighbour =
          movement.positionY + diagonalNeighbors[i].stepDiagonalY;

        if (
          checkTreasureContained(
            positionXDiagonalNeighbour,
            positionYDiagonalNeighbour,
            treasures
          )
        ) {
          cellValue = '2';
          cellColor = '#e4f1e7';
          break;
        }
      }
      for (let i = 0; i < sideNeighbors.length; i += 1) {
        const positionXSideNeighbour =
          movement.positionX + sideNeighbors[i].stepSideX;
        const positionYSideNeighbour =
          movement.positionY + sideNeighbors[i].stepSideY;
        if (
          checkTreasureContained(
            positionXSideNeighbour,
            positionYSideNeighbour,
            treasures
          )
        ) {
          cellValue = '3';
          cellColor = '#ddc1cc';
          break;
        }
      }
    }

    movementsAsignedValues.push({
      positionX: movement.positionX,
      positionY: movement.positionY,
      value: cellValue,
      color: cellColor,
    });
  });
  return movementsAsignedValues;
};

const makeTreasureMapEmpty = (treasureMap) => {
  treasureMap.map((field) => {
    field.value = '';
    field.color = '#554562';
  });
  return treasureMap;
};

const countTreasures = (treasureMap) => {
  let countTreasure = 0;
  treasureMap.forEach((field) => {
    if (field.value === 'T') countTreasure += 1;
  });
  return countTreasure;
};

module.exports = {
  checkTreasureContained,
  checkNeighbours,
  countTreasures,
  makeTreasureMapEmpty,
};
