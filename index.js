import 'dotenv/config'
import express from 'express'
import session from 'express-session'

import chatRoutes from './routes/chatRoutes.js'
import mongoose from 'mongoose'

mongoose.connect('mongodb://127.0.0.1:27017/gemini-chatbot')

.then(() => {

  console.log('MongoDB Connected')

})

.catch((err) => {

  console.log(err)

})

const app = express()

app.use(express.json())
app.use(session({

  secret:'gemini-secret-key',

  resave:false,

  saveUninitialized:true

}))

app.use(express.static('public'))

app.use('/', chatRoutes)

app.get('/test', (req, res) => {

  res.json({
    status:'API berhasil'
  })

})

const PORT = 3000

app.listen(PORT, () => {

  console.log(`Server running at http://localhost:${PORT}`)

})