const SCORE_LIMIT = 10;
const TREASURE = "T";

let users = [];
const treasureMap = [];

const getBestScores = user_name => {
  let topResults;
  const foundUser = findUserByName(user_name);
  if (foundUser) {
    topResults = foundUser.scores.sort((a, b) => a > b).slice(0, SCORE_LIMIT);
  }
  return topResults;
};
const addUser = name => users.push({ name, scores: [], movements: [] });
const findUserByName = name => users.find(user => user.name === name);

const userCanMove = (name, x, y) => {
  const foundUser = users.find(user => user.name === name);
  let foundMovement;

  if (foundUser) {
    foundMovement = foundUser.movements.find(
      movement => movement.x === x && movement.y === y
    );
  }

  return !foundMovement;
};

const makeMove = (name, positionX, positionY) => {
  const field = treasureMap.find(
    ({ x, y }) => x === positionX && y === positionY
  );

  const currentUserIndex = users.findIndex(user => user.name === name);

  if (currentUserIndex !== -1 && userCanMove(name, positionX, positionY)) {
    users[currentUserIndex].movements.push({ positionX, positionY });

    if (field.value === TREASURE) {
      users[currentUserIndex].score += 1;
    }
  }

  return field;
};

module.exports = {
  getBestScores,
  addUser,
  makeMove,
  findUserByName,
  treasureMap
};
