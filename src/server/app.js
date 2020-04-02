var express = require("express");
var cors = require("cors");
var { json } = require("body-parser");
const PORT = 3005;

var {
  getBestScores,
  addUser,
  makeMove,
  findUserByName
} = require("./database");

const app = express();
app.use(json());
app.use(cors());

app.get("/scores/top/:name", async (req, res) => {
  try {
    const { name } = req.params;
    results = await getBestScores( name );
    console.log( results )
    res.setHeader( 'Content-Type', 'application/json' )
    res.json( results );
  } catch (error) {
    console.error(error);
  }
});

app.post("/user", (req, res) => {
  try {
    const user = addUser(req.body.name);
    if (user) res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/user/move", (req, res) => {
  try {
    const { name, movements, treasureMap, treasures } = req.body;
    const result = makeMove(name, movements, treasureMap, treasures);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put("/user/score", async (req, res) => {
  try {
    const { name, score } = req.body;
    const user = await findUserByName(name);
    if (user) user.scores.push(score);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
