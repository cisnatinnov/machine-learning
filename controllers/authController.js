const express = require('express')
const app = express()
const response = require('../middlewares/response')
const { emailSchema, passwordSchema, userCreateSchema, jwtSchema, otpSchema } = require('../middlewares/schema')
const { ceckEmail, checkPassword, verifyJwt, activate } = require('../models/authModel')
const { create } = require('../models/userModel')
const { celebrate } = require("celebrate")

app.post('/checkEmail', celebrate({ body: emailSchema }), (req, res) => {
  try {
    let param = req.body;
    ceckEmail(res, param.email)
  } catch (error) {
    response.error(res, error)
  }
})

app.post('/checkPassword', celebrate({ body: passwordSchema }), (req, res) => {
  try {
    let param = req.body;
    checkPassword(res, param)
  } catch (error) {
    response.error(res, error)
  }
})

app.post('/register', celebrate({body: userCreateSchema}), (req, res) => {
  try {
    let data = req.body
    create(req, res, data)
  } catch (error) {
    response.error(res, error)
  }
})

app.post('/activate', celebrate({body: otpSchema}), (req, res) => {
  try {
    let data = req.body
    activate(res, data.otp)
  } catch (error) {
    response.error(res, error)
  }
})

app.post('/verifyJwt', celebrate({ body: jwtSchema }), (req, res) => {
  try {
    let jwt = req.body.jwt;
    verifyJwt(res, jwt)
  } catch (error) {
    response.error(res, error)
  }
})

module.exports = app