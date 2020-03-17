const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var async = require("async");
const PORT = 3005;

const db = require("./src/database");
const app = express();
app.use(bodyParser.json());
app.use(cors());

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};

app.get("/scores/top/:name", cors(corsOptions), async (req, res, body) => {
  const { name } = req.params;
  results = await db.getBestScores(name);

  res.json(results);
});

app.get("/user/:name", (req, res) => {
  try {
    const { name } = req.params;
    const user = db.findUserByName(name);
    console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.post("/user", (req, res) => {
  try {
    const user = db.addUser(req.body.name);
    if (user) res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/user/move", (req, res) => {
  console.log("map: ", db.treasureMap);

  const { name, movements } = req.body;

  const result = db.makeMove(name, movements);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
