/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const db = require('./database');

const PORT = 3005;

const app = express();
app.use(json());
app.use(cors());

app.get('/scores/top/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const results = await db.getBestScores(name);
    res.setHeader('Content-Type', 'application/json');
    res.json(results);
  } catch (error) {
    console.error(error);
  }
});

app.post('/user', (req, res) => {
  try {
    const user = db.addUser(req.body.name);
    if (user) res.send({ user });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/user/move', (req, res) => {
  try {
    const config = req.body;
    const result = db.makeMove(config);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
