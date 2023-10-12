const cors = require('cors')
const express = require('express')
const app = express()
const { getWithExpiry } = require('./middlewares/security')
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const response = require("./middlewares/response")

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
  res.render('index', { title: "Speech to Text", page: "speech/voice" })
})

app.get('/text', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Text to Speech", page: "speech/text" })
})

app.get('/input', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Question and Answer", page: "nlp/text" })
})

app.get('/classification', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Text Classification", page: "nlp/classification" })
})

app.get('/tomorse', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Text to Morse", page: "nlp/tomorse" })
})

app.get('/morse', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Morse to Text", page: "nlp/morse" })
})

app.get('/classifier', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Image Classifier", page: "vision/classifier" })
})

app.get('/face', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Face Classifier", page: "vision/faceclassifier" })
})

app.get('/imagegenerator', (_req, res) => {
  if (!getWithExpiry('email')) return res.redirect('/login')
  res.render('index', { title: "Image Generator", page: "nlp/imagegenerator" })
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
  response.success(res, "Logout Successfully", {})  
})

Object.keys(routes).forEach((route) => {
  app.use('/api/v1', routes[route]);
})

module.exports = app