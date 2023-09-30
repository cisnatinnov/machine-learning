const { Configuration, OpenAIApi } = require("openai");
const { celebrate } = require("celebrate")
const express = require('express')
const app = express()
const response = require('../middlewares/response')
const number = require('../middlewares/number')
const security = require('../middlewares/security')

const { inputSchema, numbersSchema, quadraticSchema, morseSchema, textSchema, hourSchema, switchSchema, switchVariableSchema } = require('../middlewares/schema');

require('dotenv').config()

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_OPENAI,
  apiKey: process.env.APIKEY_OPENAI,
});

const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => {
  let data = req.body
  response.success(res, 'Welcome To AI', data)
})

app.post('/input', celebrate({body: inputSchema}), async (req, res) => {
  let input = req.body.input
  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
    })
    .then((resp) => {
      response.success(res, '', { reply: resp.data.choices[0].message.content});
    })
    .catch((e) => {
      console.log(e.message)
      response.badRequest(res, `Might be content pornography or pornoaction`);
    });
})

app.post('/text', celebrate({body: textSchema}), async (req, res) => {
  let text = req.body.text

  await openai
    .createImage({
      prompt: text,
      n: 1,
      size: "512x512",
    })
    .then((resp) => {
      response.success(res, 'Image generated successfuly', { image: resp.data.data[0].url})
    })
    .catch((e) => {
      console.log(e.message)
      response.badRequest(res, `Might be content pornography or pornoaction`);
    });
})

app.post('/numbers', celebrate({body: numbersSchema}), async (req, res) => {
  let num = req.body.numbers,
  data = {
    min: number.min(num),
    max: number.max(num),
    mean: number.mean(num),
    median: number.median(num),
    mode: number.mode(num),
    range: number.range(num),
    sort: number.sort(num)
  }
  response.success(res, '', data)
})

app.post('/quadratic', celebrate({body: quadraticSchema}), (req, res) => {
  let a = req.body.a,
  b = req.body.b,
  c = req.body.c

  response.success(res, '', number.quadratic(a,b,c))
})

app.post('/morse', celebrate({body: morseSchema}), (req, res) => {
  let morse = req.body.morse,
  decoded = security.decodeMorse(morse)

  response.success(res, 'Morse Successfuly Decoded', decoded)
})

app.post('/tomorse', celebrate({body: textSchema}), (req, res) => {
  let text = req.body.text,
  endcoded = security.encodeMorse(text)

  response.success(res, 'Successfuly Encoded To Morse', endcoded)
})

app.post('/tosecond', celebrate({body: hourSchema}), (req, res) => {
  let hour = req.body.hour,
  tosecond = number.convertToSeconds(hour)

  response.success(res, 'Successfuly Convert To Second', tosecond)
})

app.post('/tominute', celebrate({body: hourSchema}), (req, res) => {
  let hour = req.body.hour,
  tominute = number.convertToMinutes(hour)

  response.success(res, 'Successfuly Convert To Minute', tominute)
})

app.post('/tohour', celebrate({body: hourSchema}), (req, res) => {
  let hour = req.body.hour,
  tohour = number.convertToHour(hour)

  response.success(res, 'Successfuly Convert To Hour', tohour)
})

app.post('/switch', celebrate({body: switchSchema}), (req, res) => {
  let a = req.body.a,
  b = req.body.b

  a = a + b;
  b = a - b;
  a = a - b;

  response.success(res, 'switch', { a: a, b: b })
})

app.post('/switchVariable', celebrate({body: switchVariableSchema}), (req, res) => {
  let a = req.body.a,
  b = req.body.b,
  c

  c = b
  b = a
  a = c

  response.success(res, 'switch', { a: a, b: b })
})

module.exports = app