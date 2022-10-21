const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const nimi = process.argv[3]
const numero = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.vhby0zp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (nimi === undefined) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(henk => {
      console.log(`${henk.name} ${henk.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: nimi,
    number: numero,
  })

  person.save()
    .then(result => {
      console.log(`added ${nimi} number ${numero} to phonebook`)
      console.log('result:', result)
      mongoose.connection.close()
    })
}