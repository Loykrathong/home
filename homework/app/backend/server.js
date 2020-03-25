const express = require('./node_modules/express')
const app = express()
const mongoose = require('mongoose')
const Bisection = require('./models/numer')
const Falseposition = require('./models/falseposition')
const Onepoint = require('./models/onepoint')
const Newton = require('./models/newton')
const Secant = require('./models/secant')
app.use(express.json())

app.listen(9000, () => {
  console.log('Application is running on port 9000')
})

mongoose.connect('mongodb+srv://loybryan:123@project-hzhaf.mongodb.net/project?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

mongoose.connection.on('error', err => {
  console.error('MongoDB error', err)
})


app.get('/bisection', async (req, res) => {
  const bisection = await Bisection.findOne({"index":Math.floor(Math.random() * 2 + 1)})
  res.json(bisection)
})

app.get('/falseposition', async (req, res) => {
  const falseposition = await Falseposition.findOne({"index":Math.floor(Math.random() * 2 + 1)})
  res.json(falseposition)
})

app.get('/onepoint', async (req, res) => {
  const onepoint = await Onepoint.findOne({"index":Math.floor(Math.random() * 2 + 1)})
  res.json(onepoint)
})

app.get('/newton', async (req, res) => {
  const newton = await Newton.findOne({"index":Math.floor(Math.random() * 2 + 1)})
  res.json(newton)
})

app.get('/secant', async (req, res) => {
  const secant = await Secant.findOne({"index":Math.floor(Math.random() * 2 + 1)})
  res.json(secant)
})



// สร้าง database schema
//const Sheep = mongoose.model('aa', { name: String })

// สร้าง instance จาก model
//const Sheeper = new Sheep({ name: 'lol' })

// save ลง database (return เป็น Promise)
//Sheeper.save().then(() => console.log('bah'))