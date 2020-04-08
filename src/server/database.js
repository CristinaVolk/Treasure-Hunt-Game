/* eslint-disable @typescript-eslint/no-var-requires */

const gameLogic = require('./gameLogic');
const init = require('./init');

const users = [];
const SCORE_LIMIT = 10;
let countMoves = 0;

const findUserByName = (name) => users.find((user) => user.name === name);

const getBestScores = (userName) => {
  let topResults;
  const foundUser = findUserByName(userName);
  if (foundUser) {
    topResults = foundUser.scores.sort((a, b) => a > b).slice(0, SCORE_LIMIT);
  }
  return topResults;
};

const addUser = (name) => {
  const lengthOfUsers = users.push({
    name,
    scores: [],
    movements: [],
    treasureMap: init.generateTreasureMap(),
    treasures: init.generateTreasures(),
  });
  return users[lengthOfUsers - 1];
};

const makeMove = (config) => {
  if (countMoves === 8) countMoves = 0;
  const currentUserIndex = users.findIndex((user) => user.name === config.name);
  const currentUser = users[currentUserIndex];
  gameLogic.enableTreasureMap(currentUser.treasureMap);
  countMoves += 1;
  const movementsAsignedValues = gameLogic.checkNeighbours(
    config.movements,
    currentUser.treasures
  );

  if (currentUserIndex !== -1) {
    movementsAsignedValues.forEach((movement) => {
      currentUser.movements.push(movement);
    });

    movementsAsignedValues.map((field) => {
      const mapFieldIndex = currentUser.treasureMap.findIndex((mapField) => {
        return (
          mapField.positionX === field.positionX &&
          mapField.positionY === field.positionY
        );
      });
      currentUser.treasureMap[mapFieldIndex].value = field.value;
      currentUser.treasureMap[mapFieldIndex].color = field.color;
    });
  }

  const dataToClient = gameLogic.obtainDataToSend(currentUser, countMoves);
  countMoves = dataToClient.countMoves;

  return {
    treasureMap: dataToClient.treasureMap,
    countMoves: dataToClient.countMoves,
    countTreasures: dataToClient.countTreasures,
  };
};

module.exports = {
  getBestScores,
  makeMove,
  findUserByName,
  addUser,
};
