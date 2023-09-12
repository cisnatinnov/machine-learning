const nodemailer = require('nodemailer');
require('dotenv').config()

const send = (mailOptions) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  transporter.sendMail(mailOptions)

  console.log("Message sent: %s");
}

module.exports = {
  send
}