const express = require('express')
const router = express.Router()
const app = express()
require('dotenv').config()

app.use(express.json())

const connectDB = require('./database/database')
connectDB();

const authRouter = require('./routes/auth.router')
const songRouter = require('./routes/song.router')
const recommendationRouter = require('./routes/recommendation.router')
const groupRouter = require('./routes/group.router')

app.use('/auth', authRouter)
app.use('/song', songRouter)
app.use('/recommendation', recommendationRouter)
app.use('/group', groupRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
