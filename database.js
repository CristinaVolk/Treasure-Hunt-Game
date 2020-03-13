const SCORE_LIMIT = 10;
const TREASURE = "T";

let users = [];
const treasureMap = [
  { x: 1, y: 1, value: TREASURE },
  { x: 2, y: 1, value: 1 },
  { x: 3, y: 1, value: 2 },
  { x: 4, y: 1, value: 3 },
  { x: 0, y: 1, value: TREASURE },
  { x: 0, y: 4, value: TREASURE }
];

const getBestScores = () => users.sort((a, b) => a > b).slice(0, SCORE_LIMIT);
const addUser = name => users.push({ name, score: 0, movements: [] });

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
  makeMove
};
