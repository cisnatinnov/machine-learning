const http = require("http");
const app = require("./app");
const server = http.createServer(app);

require('dotenv').config()

let port = process.env.PORT || 7015

const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_OPENAI,
  apiKey: process.env.APIKEY_OPENAI,
});
const openai = new OpenAIApi(configuration);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

userInterface.prompt();

userInterface.on("line", async (input) => {
  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
    })
    .then((res) => {
      console.log(res.data.choices[0].message.content);
      userInterface.prompt();
    })
    .catch((e) => {
      console.log(e);
    });
});


const socketio = require('socket.io')
const io = socketio(server)

io.on("connection", (socket) => {
  console.log("new connection")

  socket.on("sendMessage", (msg, cb) => {
    openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }],
    })
    .then((res) => {
      io.emit("message", res.data.choices[0].message.content)
    })
    .catch((e) => {
      io.emit("message", e)
    });
    cb()
  })
})

server.listen(port, () => {
  console.log('http://127.0.0.1:' + port + '/api/v1')
})