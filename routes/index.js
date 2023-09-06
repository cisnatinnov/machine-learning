const fs = require('fs');
const path = require('path');
const modules = {};

try {
  let modulePath = path.join(__dirname, '/');
  let files = fs.readdirSync(modulePath).filter((file) => {
    return file !== 'index.js';
  })
  files.forEach((o) => {
    let controllerName = o.slice(0, -3);
    modules[controllerName] = require(modulePath + controllerName);
  })
} catch (err) {
  console.log(err);
}

module.exports = modules;