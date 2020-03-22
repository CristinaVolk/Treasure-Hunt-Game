const game_logic = require("./game_logic");

const COLLS = 5;
const ROWS = 5;
const SCORE_LIMIT = 10;

let users = [];

function generateTreasureMap() {
  let treasure_map = [];
  for (let positionX = 0; positionX < ROWS; positionX++) {
    for (let positionY = 0; positionY < COLLS; positionY++) {
      treasure_map.push({
        positionX: positionX,
        positionY: positionY,
        value: ""
      });
    }
  }
  return treasure_map;
}

const getUserScore = user_name => {
  const user = findUserByName(user_name);
  return user ? user.scores : [];
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

const makeMove = (name, user_movements, treasureMap, treasures) => {
  const currentUserIndex = users.findIndex(user => user.name === name);

  const movementsAsignedValues = game_logic.check_neighbours(
    user_movements,
    treasures
  );
  console.log("treasureMap", treasureMap);
  console.log("treasure", treasures);
  console.log("user_val", movementsAsignedValues);

  if (currentUserIndex !== -1) {
    movementsAsignedValues.forEach(movement => {
      console.log(users[currentUserIndex]);
      users[currentUserIndex].movements.push(movement);
    });

    movementsAsignedValues.map(field => {
      const mapFieldIndex = treasureMap.findIndex(mapField => {
        console.log(field);
        return (
          mapField.positionX === field.positionX &&
          mapField.positionY === field.positionY
        );
      });
      treasureMap[mapFieldIndex].value = field.value;
    });
  }

  return movementsAsignedValues;
};

module.exports = {
  getBestScores,
  makeMove,
  findUserByName,
  getUserScore,
  generateTreasureMap,
  addUser
};
