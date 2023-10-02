const cors = require('cors')
const express = require('express')
const app = express()
const { getWithExpiry } = require('./middlewares/security')
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

app.use(cors());

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true, parameterLimit: 200000 }));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public')); // js, css, images

const routes = require('./routes');

app.get('/clock', (_req, res) => {
  res.render('Clock')
})

app.get('/voice', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Speech to Text", page: "machine-learning/voice" })
})

app.get('/tomorse', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Text to morse", page: "machine-learning/tomorse" })
})

app.get('/morse', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Morse to text", page: "machine-learning/morse" })
})

app.get('/classification', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Image Classification", page: "machine-learning/classification" })
})

app.get('/imagegenerator', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Image Generator", page: "machine-learning/imagegenerator" })
})

app.get('/', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Home", page: "home" })
})

app.get('/login', (_req, res) => {
  res.render('login', { title: "Login" })
})


app.get('/logout', (_req, res) => {
  localStorage.clear()
  res.redirect('/login')
})

Object.keys(routes).forEach((route) => {
  app.use('/api/v1', routes[route]);
})

module.exports = app