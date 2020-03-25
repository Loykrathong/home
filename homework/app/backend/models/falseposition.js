const mongoose = require('mongoose')
const Schema = mongoose.Schema

const falsepositionSchema = new Schema({
  index: Number,
  XL: String,
  XR: String,
  Function: String
})

const falsepositionModel = mongoose.model('falseposition', falsepositionSchema)

module.exports = falsepositionModel