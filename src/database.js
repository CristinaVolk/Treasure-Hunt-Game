const game_logic = require("./game_logic");

const SCORE_LIMIT = 10;

let users = [];
const treasureMap = []; //cells [x,y,value]

const get_treasureMap = isGameOn => (isGameOn ? treasureMap : []);

const getUserScore = user_name => {
  const user = findUserByName(user_name);
  return user ? user.scores : undefined;
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

const makeMove = (name, user_movements) => {
  const currentUserIndex = users.findIndex(user => user.name === name);
  const revealed_answers = game_logic.check_neighbours(user_movements);

  if (currentUserIndex !== -1) {
    user_movements.forEach(movement => {
      users[currentUserIndex].movements.push(movement);
    });

    revealed_answers.forEach(field => {

      const mapFieldIndex = treasureMap.findIndex(
        mapField => mapField.x === field.x && mapField.y === field.y
      );
      treasureMap[mapFieldIndex].value = field.value;

    });
   });
  }

  return revealed_answers;
};

module.exports = {
  getBestScores,
  addUser,
  makeMove,
  findUserByName,
  get_treasureMap,
  getUserScore
};
