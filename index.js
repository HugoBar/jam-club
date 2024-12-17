const express = require('express')
const router = express.Router()
const app = express()
require('dotenv').config()

app.use(express.json())

const connectDB = require('./database/database')
connectDB();

const songRouter = require('./routes/song.router')
const authRouter = require('./routes/auth.router')

app.use('/auth', authRouter)
app.use('/songs', songRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
