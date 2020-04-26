/* eslint-disable @typescript-eslint/no-var-requires */
const colorValOne = '#99848c';
const colorValTwo = '#e4f1e7';
const colorValThree = '#ddc1cc';
const colorValTreasure = '#ee6c75';

const TREASURE = 'T';
const firstProximity = '1';
const secondProximity = '2';
const thirdProximity = '3';

const diagonalNeighbors = [
  { stepDiagonalX: -1, stepDiagonalY: -1 },
  { stepDiagonalX: -1, stepDiagonalY: 1 },
  { stepDiagonalX: 1, stepDiagonalY: -1 },
  { stepDiagonalX: 1, stepDiagonalY: 1 },
];

const sideNeighbors = [
  { stepSideX: 0, stepSideY: -1 },
  { stepSideX: 0, stepSideY: 1 },
  { stepSideX: 1, stepSideY: 0 },
  { stepSideX: -1, stepSideY: 0 },
];

const checkContained = (positionX, positionY, mapArray) => {
  return mapArray.findIndex(
    (item) => item.positionX === positionX && item.positionY === positionY
  );
};

const checkNeighbours = (treasureMap, treasures) => {
  let cellValue = firstProximity;
  let cellColor = colorValOne;

  const generatedMap = treasureMap.map((field) => {
    if (checkContained(field.positionX, field.positionY, treasures) !== -1) {
      cellValue = TREASURE;
      cellColor = colorValTreasure;
    } else if (checkContained(field.positionX, field.positionY, treasures) === -1) {
      cellValue = firstProximity;
      cellColor = colorValOne;

      for (let i = 0; i < diagonalNeighbors.length; i += 1) {
        const positionXDiagonalNeighbour =
          field.positionX + diagonalNeighbors[i].stepDiagonalX;
        const positionYDiagonalNeighbour =
          field.positionY + diagonalNeighbors[i].stepDiagonalY;

        if (
          checkContained(
            positionXDiagonalNeighbour,
            positionYDiagonalNeighbour,
            treasures
          ) !== -1
        ) {
          cellValue = secondProximity;
          cellColor = colorValTwo;
          break;
        }
      }
      for (let i = 0; i < sideNeighbors.length; i += 1) {
        const positionXSideNeighbour = field.positionX + sideNeighbors[i].stepSideX;
        const positionYSideNeighbour = field.positionY + sideNeighbors[i].stepSideY;
        if (
          checkContained(
            positionXSideNeighbour,
            positionYSideNeighbour,
            treasures
          ) !== -1
        ) {
          cellValue = thirdProximity;
          cellColor = colorValThree;
          break;
        }
      }
    }

    return {
      ...field,
      value: cellValue,
      color: cellColor,
    };
  });
  return generatedMap;
};

const makeTreasureMapEmpty = (treasureMap) => {
  return treasureMap.map((field) => {
    return { ...field, color: '', isEnabled: false, value: '' };
  });
};

const enableTreasureMap = (treasureMap) => {
  return treasureMap.map((field) => {
    return { ...field, isEnabled: false };
  });
};

const countNumberOfTreasures = (treasureMap) => {
  return treasureMap.filter(
    (field) => field.value === TREASURE && field.isRevealed === true
  ).length;
};

module.exports = {
  checkContained,
  checkNeighbours,
  makeTreasureMapEmpty,
  enableTreasureMap,
  countNumberOfTreasures,
};
