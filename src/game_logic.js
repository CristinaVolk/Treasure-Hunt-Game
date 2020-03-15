const TREASURES = [];

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};
const generateTreasures = () => {
  let i = 0;
  while (i < 3) {
    let x = getRandomInt(5);
    let y = getRandomInt(5);
    if (check_exists(y, x, array_treasures)) continue;
    this.board[y][x] = true;
    TREASURES.push({ y, x });
    i++;
  }
  return TREASURES;
};

const check_exists = (y, x, map_array) =>
  map_array.some(item => item.x === x && item.y === y) ? true : false;

const check_neighbours = user_movements => {
  let cellValue = `1`;
  let revealedAnswers = []; //

  let diagonal_neighbors = [
    { y_n: -1, x_n: -1 },
    { y_n: -1, x_n: 1 },
    { y_n: 1, x_n: 1 },
    { y_n: 1, x_n: -1 }
  ];

  let side_neighbors = [
    { y_n: -1, x_n: 0 },
    { y_n: 0, x_n: 1 },
    { y_n: 1, x_n: 0 },
    { y_n: 0, x_n: -1 }
  ];

  user_movements.forEach(movement => {
    if (check_exists(movement.y, movement.x, TREASURES)) {
      cellValue = `T`;
    } else {
      for (let i = 0; i < diagonal_neighbors.length; i++) {
        let x1 = movement.x + diagonal_neighbors[i].x_n;
        let y1 = movement.y + diagonal_neighbors[i].y_n;

        if (check_exists(y1, x1, TREASURES)) {
          cellValue = `2`;
          break;
        }
      }
      for (let i = 0; i < side_neighbors.length; i++) {
        let x1 = movement.x + side_neighbors[i].x_n;
        let y1 = movement.y + side_neighbors[i].y_n;
        if (check_exists(y1, x1, TREASURES)) {
          cellValue = `3`;
          break;
        }
      }
    }

    revealedAnswers.push({
      positionY: movement.y,
      positionX: movement.x,
      value: cellValue
    });
  });

  return revealedAnswers;
};

module.exports = {
  check_exists,
  check_neighbours,
  generateTreasures,
  TREASURES
};
