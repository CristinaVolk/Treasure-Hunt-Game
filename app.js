const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3005;

const db = require("./src/database");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/scores/top/:name", (req, res) => {
  const { name } = req.params;
  request(
    { url: `http://localhost:3005/scores/top/${name}` },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: err.message });
      }
      res.json(JSON.parse(body));
    }
  );
});

app.get("/user/:name", (req, res) => {
  const { name } = req.params;

  const user = db.findUserByName(name);
  console.log(user);
  res.send(user);
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
