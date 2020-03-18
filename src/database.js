const game_logic = require("./game_logic");

const COLLS = 5;
const ROWS = 5;
const SCORE_LIMIT = 10;

let users = [];

function generateTreasureMap() {
  let treasure_map = [];
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLLS; y++) {
      treasure_map.push({ x: x, y: y, value: "" });
    }
  }
  return treasure_map;
}

const getUserScore = user_name => {
  const user = findUserByName(user_name);
  return user ? user.scores : {};
};

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

const makeMove = (name, user_movements, treasureMap, TREASURES) => {
  const currentUserIndex = users.findIndex(user => user.name === name);

  const revealed_answers = game_logic.check_neighbours(
    user_movements,
    TREASURES
  );

  if (currentUserIndex !== -1) {
    user_movements.forEach(movement => {
      users[currentUserIndex].movements.push(movement);
    });

    revealed_answers.forEach(field => {
      const mapFieldIndex = treasureMap.findIndex(mapField => {
        return mapField.x === field.positionX && mapField.y === field.positionY;
      });
      treasureMap[mapFieldIndex].value = field.value;
    });
  }

  return revealed_answers;
};

module.exports = {
  getBestScores,
  makeMove,
  findUserByName,
  getUserScore,
  generateTreasureMap,
  addUser
};
