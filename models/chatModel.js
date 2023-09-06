const response = require('../middlewares/response')
const query = require('../middlewares/query')
const { unix } = require('../middlewares/dateFormat')
const { PostgreSQL } = require('../configs/connection')
const uuid = require("uuid").v4

const sendMessage = (req, res, data) => {
  try {
    let obj = [{
      message_id: uuid(),
      room_id: data.room_id,
      user_id: data.user_id,
      message: data.message,
      created_dt: unix(),
      created_by: req.session.user_id
    }],
    insert = query.insert('tb_m_message', obj, 'message_id')
    PostgreSQL.query(insert, (error, _results) => {
      if (error) response.error(res, error)
      else {
        selectRoom = {
          table: 'tb_m_rooms',
          select: 'room_nm'
        },
        conditionRoom = {
          room_id: data.room_id
        },
        joinRoom = []
        let findRoom = query.select(selectRoom, conditionRoom, joinRoom)
        PostgreSQL.query(findRoom, (errRoom, rows) => {
          if (errRoom) response.error(res, errRoom)
          else response.success(res, 'Message Sent', Object.assign(data, rows.rows[0]))
        })
      }
    })
  } catch (error) {
    response.error(res, error)
  }
}

module.exports = {
  sendMessage
}