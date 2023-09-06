const response = require('../middlewares/response')
const query = require('../middlewares/query')
const { genBcript, validateEmail, validPassword, otp } = require('../middlewares/security')
const { unix } = require('../middlewares/dateFormat')
const { PostgreSQL } = require('../configs/connection')
const uuid = require("uuid").v4
var nodemailer = require('nodemailer');

require('dotenv').config()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const read = (res, param, condition, join) => {
  try {
    let page = 1, limit = 100
    if(condition.page) {
      page = condition.page
      delete condition.page
    }
    if(condition.limit) {
      limit = condition.limit
      delete condition.limit
    }
    let objParam = Object.assign(param, { limit: limit, page: page })
    let sql = query.select(objParam, condition, join)
    PostgreSQL.query(sql, (error, result) => {
      let all = query.select(param, condition, join)
      PostgreSQL.query(all, (errAll, resultAll) => {
        if (errAll) response.error(res, error)
        else {
          let obj = {
            total: resultAll.rowCount,
            total_page: Math.ceil(resultAll.rowCount/limit),
            data: result.rows
          }
          response.success(res, `User data found ${result.rowCount}`, obj)
        }
      })
    })
  } catch (error) {
    response.error(res, error)
  }
}

const create = (req, res, data) => {
  try {
    const user = {
      email : data.email,
      username : data.username,
      password: data.password,
      confirmPassword: data.confirmPassword
    },
    person = {
      person_nm: data.person_nm,
      person_birth_place: data.person_birth_place,
      person_birth_dt: data.person_birth_dt,
      person_address: data.person_address,
    }
    if (!validateEmail(user.email)) {
      response.notAllowed(res, `Email ${user.email} Invalid email format`)
      return
    }
    if (!validPassword(user.password)) {
      response.notAllowed(res, 'Please use minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character!')
      return
    }    
    if (user.confirmPassword) {
      if (user.confirmPassword != user.password) {
        response.notAllowed(res, `Password didn't match`)
        return
      }
      delete user.confirmPassword
    }
    let password = genBcript(user.password)
    let selectEmail = {
      table: 'tb_m_users',
      select: 'email'
    },
    conditionEmail = {
      email: user.email
    },
    joinEmail = [],
    queryEmail = query.select(selectEmail, conditionEmail, joinEmail)
    PostgreSQL.query(queryEmail, (errEMail, resultEmail) => {
      if (errEMail) response.error(res, errEMail)
      else {
        if (resultEmail.rowCount > 0) response.notAllowed(res, `Email ${data.email} already registered`)
        else {
          let selectUsername = {
            table: 'tb_m_users',
            select: 'username'
          },
          conditionUsername = {
            username: user.username
          },
          joinUsername = [],
          queryUsername = query.select(selectUsername, conditionUsername, joinUsername)
          PostgreSQL.query(queryUsername, (errUsername, resultUsername) => {
            if (errUsername) response.error(res, errUsername)
            else {
              if (resultUsername.rowCount > 0) response.notAllowed(res, `Username ${data.username} already registered`)
              else {
                let user_id = uuid(), created_by = user_id
                if (req.session !== undefined) {
                  created_by = req.session.user_id
                }
                let insert = [],
                onetimepassword = otp(8),
                objData = Object.assign(user, {
                  user_id: user_id,
                  password: password,
                  otp: onetimepassword,
                  created_dt: unix(),
                  created_by: created_by
                })
                insert.push(objData)
                let queryInsert = query.insert('tb_m_users', insert, 'user_id')                
                PostgreSQL.query(queryInsert, (errInsert, resultInsert) => {
                  if (errInsert) return response.error(res, errInsert)
                  let insertPerson = [],
                  objDataPerson = Object.assign(person, {
                    person_id: uuid(),
                    created_dt: unix(),
                    created_by: created_by
                  })
                  insertPerson.push(objDataPerson)
                  let queryPersonInsert = query.insert('tb_m_persons', insertPerson, 'person_id')
                  PostgreSQL.query(queryPersonInsert, (errInsertPerson, resultInsertPerson) => {
                    if (errInsertPerson) return response.error(res, errInsertPerson)
                    var mailOptions = {
                      from: process.env.EMAIL,
                      to: user.email,
                      subject: 'OTP',
                      text: `This is your one time password ${onetimepassword}`
                    };
                    let objResponse = { user: resultInsert.rows[0].user_id, person: resultInsertPerson.rows[0].person_id },
                    insertUserPerson = [{ user_person_id: uuid(), user_id: objResponse.user, person_id: objResponse.person, created_dt: unix(), created_by: created_by }],
                    queryUserInsert = query.insert('tb_r_user_person', insertUserPerson, 'user_person_id')
                    PostgreSQL.query(queryUserInsert, (errInsertUser, resultInsertUser) => {
                      if (errInsert) return response.error(res, errInsertUser)
                      transporter.sendMail(mailOptions, (err, info) => {
                        if (err) return response.error(res, err)
                        objResponse = Object.assign(objResponse, { user_person_id: resultInsertUser.rows[0].user_person_id, info: 'OTP has been sent to your email' })
                        response.created(res, 'User successfuly inserted', objResponse)                        
                      })
                    })
                  })
                })
              }
            }
          })
        }
      }
    })
  } catch (error) {
    response.error(res, error)
  }
}

const update = (req, res, data, id) => {
  try {
    if (!validateEmail(data.email)) return response.notAllowed(res, `${email} Invalid email format`)
    if (data.confirmPassword) {
      if (!validPassword(data.password)) {
        response.notAllowed(res, 'Please use minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character!')
        return
      }
      let password = genBcript(data.password)
      delete data.password
      delete data.confirmPassword
      data.password = password
    }
    let objData = Object.assign(data, {updated_dt: unix(), updated_by: req.session.user_id})
    let condition = { user_id: id }
    let update = query.update('tb_m_users', objData, condition)
    PostgreSQL.query(update, (err, rows) => {
      if (err) return response.error(res, err)
      response.created(res, 'User successfully updated', rows.rows)
    })
  } catch (error) {
    response.error(res, error)
  }
}

const del = (req, res, id) => {
  try {
    let objData = {status: 0, updated_dt: unix(), updated_by: req.session.user_id}
    let condition = { user_id: id }
    let update = query.update('tb_m_users', objData, condition)
    PostgreSQL.query(update, (err, rows) => {
      if (err) return response.error(res, err)
      response.success(res, 'User successfully deleted', rows.rows)
    })
  } catch (error) {
    response.error(res, error)
  }
}

const delPermanent = (res, id) => {
  try {
    let condition = { user_id: id }
    let del = query.del('tb_m_users', condition)
    PostgreSQL.query(del, (err, rows) => {
      if (err) return response.error(res, err)
      response.success(res, 'User successfully deleted', rows.rows)
    })
  } catch (error) {
    response.error(res, error)
  }
}

module.exports = {
  read,
  create,
  update,
  del,
  delPermanent
}