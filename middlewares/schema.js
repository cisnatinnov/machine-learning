const { Joi } = require('celebrate')

const emailSchema = Joi.object().keys({
  email: Joi.string().max(64).required()
}).unknown(true)

const otpSchema = Joi.object().keys({
  otp: Joi.string().required()
}).unknown(true)

const jwtSchema = Joi.object().keys({
  jwt: Joi.string().required()
}).unknown(true)

const passwordSchema = Joi.object().keys({
  email: Joi.string().max(64).required(),
  password: Joi.string().min(8).required()
}).unknown(true)

const userCreateSchema = Joi.object().keys({
  person_nm: Joi.string().required(),
  person_birth_place: Joi.string().required(),
  person_birth_dt: Joi.string().required(),
  person_address: Joi.string().required(),
  email: Joi.string().max(64).required(),
  username: Joi.string().max(64).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required()
}).unknown(true)

const userUpdateSchema = Joi.object().keys({
  user_id: Joi.string().required(),
  email: Joi.string().max(64).required(),
  username: Joi.string().max(64).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required()
}).unknown(true)

const changePasswordSchema = Joi.object().keys({
  user_id: Joi.string().required(),
  email: Joi.string().max(64).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required()
}).unknown(true)

const userIdSchema = Joi.object().keys({
  user_id: Joi.string().required()
}).unknown(true)

const inputSchema = Joi.object().keys({
  input: Joi.string().min(3).required()
}).unknown(true)

const numbersSchema = Joi.object().keys({
  numbers: Joi.array().min(3).required()
}).unknown(true)

const quadraticSchema = Joi.object().keys({
  a: Joi.number().required(),
  b: Joi.number().required(),
  c: Joi.number().required()
}).unknown(true)

const joinSchema = Joi.object().keys({
  username: Joi.string().required(),
  room: Joi.string().required()
}).unknown(true)

const messageSchema = Joi.object().keys({
  user_id: Joi.string().required(),
  room_id: Joi.string().required(),
  message: Joi.string().required()
}).unknown(true)

const morseSchema = Joi.object().keys({
  morse: Joi.string().required()
}).unknown(true)

const textSchema = Joi.object().keys({
  text: Joi.string().required()
}).unknown(true)

const hourSchema = Joi.object().keys({
  hour: Joi.number().required()
}).unknown(true)

const switchSchema = Joi.object().keys({
  a: Joi.number().required(),
  b: Joi.number().required()
}).unknown(true)

const switchVariableSchema = Joi.object().keys({
  a: Joi.string().required(),
  b: Joi.string().required()
}).unknown(true)

module.exports = {
  emailSchema,
  passwordSchema,
  userCreateSchema,
  userUpdateSchema,
  changePasswordSchema,
  userIdSchema,
  inputSchema,
  numbersSchema,
  quadraticSchema,
  jwtSchema,
  joinSchema,
  messageSchema,
  morseSchema,
  textSchema,
  hourSchema,
  switchSchema,
  switchVariableSchema,
  otpSchema
}