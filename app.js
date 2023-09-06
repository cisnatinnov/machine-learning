const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors());

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true, parameterLimit: 200000 }));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public')); // js, css, images

const routes = require('./routes');

app.get('/clock', (_req, res) => {
  res.render('clock')
})

app.get('/voice', (_req, res) => {
  res.render('voice')
})

app.get('/classification', (_req, res) => {
  res.render('classification')
})

Object.keys(routes).forEach((route) => {
  app.use('/api/v1', routes[route]);
})

module.exports = app