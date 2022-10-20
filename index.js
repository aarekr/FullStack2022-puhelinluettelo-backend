require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people<br />${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(mongo_people => {
    res.json(mongo_people)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(1000 * Math.random())
  return newId
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log("backendin req.body:", body)
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  let nimiJoLuettelossa = false
  henkilo_loytyi = persons.map(person => {
    person.name === body.name ? nimiJoLuettelossa = true : ""
  })
  if (nimiJoLuettelossa === true) {
    return res.status(400).json({
      error: 'person already added'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  res.json(person)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})