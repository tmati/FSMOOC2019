const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give Mongo cluster password as argument!')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://MOOCuser:${password}@tm-cluster-sv3gi.mongodb.net/contacts-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

console.log(process.argv)
console.log(process.argv.length)

if (process.argv.length === 5) {
    const contact = new Contact({
        name: name,
        number: number,
    })

    contact.save().then(result => {
        console.log(`added ${name} with number ${number} to contacts`)
        mongoose.connection.close()

    })
} else if (process.argv.length === 3) {
    console.log('Phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}


