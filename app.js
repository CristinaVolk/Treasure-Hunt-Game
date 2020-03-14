const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3005;

const db = require("./src/database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/scores/top/:name", (req, res) => {
  const { name } = req.params;
  try {
    const results = db.getBestScores(name);

    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:name", (req, res) => {
  const { name } = req.params;

  const user = db.findUserByName(name);
  res.send(user.name);
});

app.post("/user", (req, res) => {
  const { name } = req.body;

  db.addUser(name);

  res.sendStatus(201);
});

app.post("/user/move", (req, res) => {
  const MOVEMENT_LIMIT = 3;

  const { name, movements } = req.body;

  const result = movements
    .slice(0, MOVEMENT_LIMIT)
    .map(({ x, y }) => db.makeMove(name, x, y));

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
