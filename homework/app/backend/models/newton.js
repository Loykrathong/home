const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newtonSchema = new Schema({
  index: Number,
  X: String,
  Function: String
})

const newtonModel = mongoose.model('newton', newtonSchema)

module.exports = newtonModel