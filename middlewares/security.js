const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const response = require('./response')
require('dotenv').config();

const genBcript = (password) => {
  try {
    let pass = bcrypt.hashSync(password, 8)
    return pass
  } catch (error) {
    console.log(error)
    return false
  }
}

const compare = (pass, password) => {
  try {
    let result = bcrypt.compareSync(password, pass);
    return result;
  } catch (error) {
    console.log(error)
    return false
  }
}

const genJwt = (payload) => {
  try {
    let secret = process.env.JWT_SECRET;
    let token = jwt.sign(payload, secret, { expiresIn: 86400 });
    return token
  } catch (error) {
    console.log(error)
    return false
  }
}

const verifyJwt = (req, res, next) => {
  try {
    let authorization = req.headers["authorization"];

    if (!authorization) {
      return response.notAllowed(res, 'No token provide')
    }
    let token = authorization.split(" ")[1];
    if (!token) return response.notAllowed(res, 'No token provide');
    let secret = process.env.JWT_SECRET;
    let decoded = jwt.verify(token, secret);
    req.session = decoded
    next()
  } catch (error) {
    return response.notAllowed(res, error)
  }
}

const validateEmail = (email) => {
  let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return res.test(email);
}

const validPassword = (password) => {
  let res = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return res.test(password);
}

const otp = (length) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const bin2hex = (s) => {
  let i
  let l
  let o = ''
  let n
  s += ''
  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i)
      .toString(16)
    o += n.length < 2 ? '0' + n : n
  }
  return o
}

const hex2bin = (s) => {
  const ret = []
  let i = 0
  let l
  s += ''
  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16)
    const k = parseInt(s.substr(i + 1, 1), 16)
    if (isNaN(c) || isNaN(k)) return false
    ret.push((c << 4) | k)
  }
  return String.fromCharCode.apply(String, ret)
}

const decodeMorse = (morseCode) => {
  var ref = { 
    '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd',
    '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h',
    '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l',
    '--': 'm', '-.': 'n', '---': 'o', '.--.':   'p',
    '--.-': 'q', '.-.': 'r', '...': 's', '-': 't',
    '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
    '-.--': 'y', '--..': 'z', '.----':  '1', '..---':  '2',
    '...--':  '3', '....-':  '4', '.....':  '5', '-....':  '6',
    '--...':  '7', '---..':  '8', '----.':  '9', '-----':  '0',
  };

  return morseCode
    .split('   ')
    .map(
      a => a
        .split(' ')
        .map(
          b => ref[b]
        ).join('')
    ).join(' ');
}

const encodeMorse = (text) => {
  var alphabet = {
    'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
    'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
    'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
    'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
    'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
    'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
    'y': '-.--',  'z': '--..',  ' ': '/',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
    '9': '----.', '0': '-----', 
  }

  return text.split('')
    .map(function(e){
      return alphabet[e.toLowerCase()] || '';
    })
    .join(' ')
    .replace(/ +/g, ' ');
} 

module.exports = {
  genBcript,
  compare,
  genJwt,
  verifyJwt,
  validateEmail,
  validPassword,
  otp,
  bin2hex,
  hex2bin,
  decodeMorse,
  encodeMorse
}