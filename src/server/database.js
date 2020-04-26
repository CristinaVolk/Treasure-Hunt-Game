/* eslint-disable @typescript-eslint/no-var-requires */

const gameLogic = require('./gameLogic');
const init = require('./init');

const users = [];
const SCORE_LIMIT = 10;
const MAX_TREASURES = 3;
const MAX_MOVES = 8;
let countTreasures = 0;

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
  const treasures = init.generateTreasures();
  const emptyTreasureMap = init.generateTreasureMap();
  const treasureMapWithValues = gameLogic.checkNeighbours(
    emptyTreasureMap,
    treasures
  );

  const lengthOfUsers = users.push({
    name,
    scores: [],
    movements: [],
    treasureMap: treasureMapWithValues,
    treasures,
    countMoves: 0,
  });
  return users[lengthOfUsers - 1];
};

const makeMove = (config) => {
  const currentUserIndex = users.findIndex((user) => user.name === config.name);
  const currentUser = users[currentUserIndex];
  currentUser.countMoves += 1;

  currentUser.movements = [...currentUser.movements, ...config.movements];
  gameLogic.enableTreasureMap(currentUser.treasureMap);

  const newMap = currentUser.treasureMap.map((field) =>
    gameLogic.checkContained(field.positionX, field.positionY, config.movements) !==
    -1
      ? { ...field, isRevealed: true }
      : { ...field }
  );

  currentUser.treasureMap = [...newMap];

  countTreasures = gameLogic.countNumberOfTreasures(currentUser.treasureMap);

  if (currentUser.countMoves === MAX_MOVES || countTreasures === MAX_TREASURES) {
    if (countTreasures === MAX_TREASURES)
      currentUser.scores.push(currentUser.countMoves);
    const countMovesToSend = currentUser.countMoves;

    currentUser.treasures = init.generateTreasures();
    const newTreasureMap = init.generateTreasureMap();
    currentUser.treasureMap = gameLogic.checkNeighbours(
      newTreasureMap,
      currentUser.treasures
    );
    currentUser.countMoves = 0;
    return {
      treasureMap: currentUser.treasureMap,
      countMoves: countMovesToSend,
      countTreasures,
    };
  }

  return {
    treasureMap: currentUser.treasureMap,
    countMoves: currentUser.countMoves,
    countTreasures,
  };
};

module.exports = {
  getBestScores,
  makeMove,
  findUserByName,
  addUser,
};
