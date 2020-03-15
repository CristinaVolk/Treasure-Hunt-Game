const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3005;

const db = require("./src/database");
const app = express();
app.use(bodyParser.json());
app.use(cors());

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get("/scores/top/:name", cors(corsOptions), (req, res, body) => {
  const { name } = req.params;
  results = db.getBestScores(name);

  //res.json(JSON.parse(body));
  res.json({ msg: "This is CORS-enabled for only example.com." });
});

app.get("/user/:name", (req, res) => {
  const { name } = req.params;

  const user = db.findUserByName(name);
  console.log(user);
  res.send(user);
});

app.post("/user", (req, res) => {
  const { name } = req.body;

  const user = db.addUser(name);
  if (user) console.log(user);
  res.sendStatus(201);
});

app.post("/user/move", (req, res) => {
  const { name, movements } = req.body;

  const result = db.makeMove(name, movements);

  res.json(result);
});

/*app.post("/user/move", (req, res) => {
  const MOVEMENT_LIMIT = 3;

  const { name, movements } = req.body;

  const result = movements
    .slice(0, MOVEMENT_LIMIT)
    .map(({ x, y }) => db.makeMove(name, x, y));

  res.json(result);
});*/

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
