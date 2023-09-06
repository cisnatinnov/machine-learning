const express = require('express')
const { celebrate } = require("celebrate")
const app = express()
const response = require('../middlewares/response')
const { verifyJwt } = require('../middlewares/security')
const { joinSchema } = require('../middlewares/schema')
const { join } = require('../models/userModel')

const ai = require('../controllers/AIController')
const auth = require('../controllers/authController')
const user = require('../controllers/userController')

app.get('/', (req, res) => {
  response.success(res, 'Welcome to AI', req.body)
})

app.post('/join', celebrate({ body: joinSchema }), (req, res) => {
  try {
    let data = req.body
    join(res, data)
  } catch (error) {
    response.error(res, error)
  }
})

app.use('/auth', auth)
app.use('/users', verifyJwt, user)
app.use('/ai', verifyJwt, ai)

module.exports = app