import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { db } from './database'

const PORT = 3005

const app = express()
app.use(json())
app.use(cors())

app.get('/scores/top/:name', async (req, res) => {
  try {
    const { name } = req.params
    const results = await db.getBestScores(name)
    console.log(results)
    res.setHeader('Content-Type', 'application/json')
    res.json(results)
  } catch (error) {
    console.error(error)
  }
})

app.post('/user', (req, res) => {
  try {
    const user = db.addUser(req.body.name)
    if (user) res.sendStatus(201)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.post('/user/move', (req, res) => {
  try {
    const config = req.body
    const result = db.makeMove(config)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.put('/user/score', async (req, res) => {
  try {
    const { name, score } = req.body
    const user = await db.findUserByName(name)
    if (user) user.scores.push(score)
    res.send(user)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`)
})
