const express = require('express')
const app = express()
const response = require('../middlewares/response')
const { read, create, update, del, delPermanent, join } = require('../models/userModel')
const { celebrate } = require("celebrate")
const { userCreateSchema, userUpdateSchema, changePasswordSchema, userIdSchema } = require('../middlewares/schema')

app.get('/', (req, res) => {
  try {
    let param = { table: 'tb_m_users', select: '*' }
    let condition = req.query
    let join = []
    read(res, param, condition, join)
  } catch (error) {
    response.error(res, error)
  }
})

app.post('/', celebrate({body: userCreateSchema}), (req, res) => {
  try {
    let data = req.body
    create(req, res, data)
  } catch (error) {
    response.error(res, error)
  }
})

app.put('/', celebrate({body: userUpdateSchema}), (req, res) => {
  try {
    let data = req.body
    update(req, res, data, data.user_id)
  } catch (error) {
    response.error(res, error)
  }
})

app.put('/password', celebrate({body: changePasswordSchema}), (req, res) => {
  try {
    let data = req.body
    update(req, res, data, data.user_id)
  } catch (error) {
    response.error(res, error)
  }
})

app.put('/delete', celebrate({body: userIdSchema}), (req, res) => {
  try {
    let data = req.body
    del(req, res, data.user_id)
  } catch (error) {
    response.error(res, error)
  }
})

app.delete('/', celebrate({body: userIdSchema}), (req, res) => {
  try {
    let data = req.body
    delPermanent(res, data.user_id)
  } catch (error) {
    response.error(res, error)
  }
})

module.exports = app