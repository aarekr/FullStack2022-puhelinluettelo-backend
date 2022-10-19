const express = require('express')
const app = express()

let persons = [
    {
      name: 'Arto Hellas',
      number: '040-1231244',
      id: 1
    },
    {
      name: 'Ada Lovelace',
      number: '+31-231-12314',
      id: 2
    },
    {
      name: 'Dan Abramov',
      number: '12-43-234345',
      id: 3
    },
    {
      name: 'Mary Poppendieck',
      number: '39-23-6423122',
      id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people<br />${new Date()}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})