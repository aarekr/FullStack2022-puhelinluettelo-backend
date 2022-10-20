require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(mongo_people => {
    res.send(`Phonebook has info for ${mongo_people.length} people<br />${new Date()}`)
  })
  .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(mongo_people => {
    res.json(mongo_people)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log("backendin req.body:", body)
  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
      res.json(savedPerson)
      console.log(`added ${body.name} number ${body.number} to phonebook`)
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error("error.message:", error.message)
  console.error("error.name   :", error.name)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'some character(s) wrong in the id' })
  }
  else if (error.name === 'ReferenceError') {
    return res.status(400).send({ error: 'malformatted reference' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})