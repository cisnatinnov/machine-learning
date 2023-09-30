const response = require('../middlewares/response')
const query = require('../middlewares/query')
const { genJwt, compare, validateEmail, validPassword, setWithExpiry } = require('../middlewares/security')
const { PostgreSQL } = require('../configs/connection')
const jwt = require('jsonwebtoken');

const ceckEmail = (res, email) => {
  try {
    if (validateEmail(email)) {
      let param = { select: 'tb_m_users', select: 'email' }
      let condition = { email: email }
      let join = []
      let user = query.select(param, condition, join)
      PostgreSQL.query(user, (err, results) => {
        if (err) {
          console.log(err)
          response.error(res, 'error')
        }
        else {
          if (results.rowCount > 0) {
            let email = results.rows[0].email
            response.success(res, 'Email registered', email)
          }
          else response.notFound(res, 'Email not found')
        }
      })
    }
    else response.notAllowed(res, `${email} Invalid email format`)
  } catch (error) {
    console.log(error)
    response.error(res, 'error')
  }
}

const checkPassword = (res, data) => {
  try {
    if (!validateEmail(data.email)) {
      response.notAllowed(res, `${data.email} Invalid email format`)
      return
    }
    if (!validPassword(data.password)) {
      response.notAllowed(res, 'Please use minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character!')
      return
    }
    let param = { table: 'tb_m_users', select: '*' }
    let condition = { email: data.email }
    let join = []
    let queryUser = query.select(param, condition, join)
    PostgreSQL.query(queryUser, (err, results) => {
      if (err) {
        response.error(res, err)
      }
      else {
        if (results.rowCount > 0) {
          let user = results.rows[0]
          let pass = compare(user.password, data.password)
          if (pass) {
            let token = genJwt(user)
            let jwt_payload = {}
            if (token) {
              setWithExpiry("user_id", user.user_id)
              setWithExpiry("email", user.email)
              setWithExpiry("password", user.password)
              setWithExpiry("username", user.username)
              let param = { select: 'tb_m_users', select: 'email, status' }
              let condition = { email: data.email }
              let join = []
              let select = query.select(param, condition, join)
              PostgreSQL.query(select, (err, results) => {
                if (err) return response.error(res, err)
                if (results.rows[0].status === 0) return response.notAllowed(res, 'User not active yet')
                jwt_payload = Object.assign(user, {token:token})
                response.success(res, 'Login successfully', jwt_payload)
              })
            }
            else response.error(res, 'Error during generate token')
          }
          else response.notAllowed(res, 'Wrong Password')
        }
        else response.notFound(res, 'Email not found')
      }
    })
  } catch (error) {
    console.log(error)
    response.error(res, 'error')
  }
}

const activate = (res, otp) => {
  let param = { table: 'tb_m_users', select: 'user_id, otp' }
  let condition = { otp: otp }
  let join = []
  let queryUser = query.select(param, condition, join)
  PostgreSQL.query(queryUser, (err, rows) => {
    if (err) return response.error(res, err)
    if (rows.rowCount === 0) return response.notAllowed(res, 'OTP missmatch')
    let condition = { user_id: rows.rows[0].user_id }
    let update = query.update('tb_m_users', { status: 1 }, condition)
    PostgreSQL.query(update, (error, results) => {
      if (error) return response.error(res, error)
      response.success(res, 'User activated', {otp: otp, user: results.rowCount})
    })
  })
}

const verifyJwt = (token) => {
  try {
    let secret = process.env.JWT_SECRET;
    let decoded = jwt.verify(token, secret);
    req.session = decoded
    response.success(res, '', decoded);
  } catch (error) {
    response.notAllowed(res, error)
  }
}

module.exports = {
  ceckEmail,
  checkPassword,
  activate,
  verifyJwt
}