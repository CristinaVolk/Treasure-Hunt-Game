const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

const generateTreasures = () => {
  let treasures = [];
  let i = 0;
  while (i < 3) {
    let x = getRandomInt(5);
    let y = getRandomInt(5);
    if (check_exists(x, y, treasures)) continue;

    treasures.push({ x, y });
    i++;
  }
  return treasures;
};

const check_exists = (x, y, map_array) => {
  return map_array.find(item => item.x === x && item.y === y);
};

const check_neighbours = (movements, treasures) => {
  let cellValue = `1`;
  let movementsAsignedValues = [];

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

  movements.forEach(movement => {
    if (check_exists(movement.x, movement.y, treasures)) {
      cellValue = `T`;
    } else {
      for (let i = 0; i < diagonal_neighbors.length; i++) {
        let x1 = movement.x + diagonal_neighbors[i].x_n;
        let y1 = movement.y + diagonal_neighbors[i].y_n;

        if (check_exists(x1, y1, treasures)) {
          cellValue = `2`;
          break;
        }
      }
      for (let i = 0; i < side_neighbors.length; i++) {
        let x1 = movement.x + side_neighbors[i].x_n;
        let y1 = movement.y + side_neighbors[i].y_n;
        if (check_exists(x1, y1, treasures)) {
          cellValue = `3`;
          break;
        }
      }
    }

    movementsAsignedValues.push({
      positionX: movement.x,
      positionY: movement.y,
      value: cellValue
    });
  });
  return movementsAsignedValues;
};

module.exports = {
  check_exists,
  check_neighbours,
  generateTreasures
};
