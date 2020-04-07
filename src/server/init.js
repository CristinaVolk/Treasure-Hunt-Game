// eslint-disable-next-line @typescript-eslint/no-var-requires
const gameLogic = require('./gameLogic');

const COLLS = 5;
const ROWS = 5;
const COLOR = '#554562';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const generateTreasures = () => {
  const treasures = [];
  let i = 0;
  while (i < 3) {
    const positionX = getRandomInt(5);
    const positionY = getRandomInt(5);
    if (gameLogic.checkTreasureContained(positionX, positionY, treasures)) continue;

    treasures.push({ positionX, positionY });
    i += 1;
  }
  return treasures;
};

const generateTreasureMap = () => {
  const treasureMap = [];
  for (let positionX = 0; positionX < ROWS; positionX += 1) {
    for (let positionY = 0; positionY < COLLS; positionY += 1) {
      treasureMap.push({
        positionX,
        positionY,
        value: '',
        color: COLOR,
        isEnabled: true,
      });
    }
  }
  return treasureMap;
};

module.exports = {
  generateTreasureMap,
  generateTreasures,
};
