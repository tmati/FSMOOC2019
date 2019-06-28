require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))



/*
const requestLogger = (request, response, next) => {
    console.log('Method:  ', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)
*/


//Landing
app.get('/api/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

//Info page
app.get('/info', (req, res) => {
    const number = Contact.countDocuments({}, function (err, count) {
        res.send(`You have ${count} contacts in your phonebook <br /> <br /> ${new Date()}`)
    })

})

//Add contact
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save().then(savedContact => {
        return savedContact.toJSON()
    })
        .then(savedAndFormattedContact => {
            response.json(savedAndFormattedContact)
        })
        .catch(error => next(error))
})

//All persons
app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts.map(c => c.toJSON()))
    })
})

//Single person by id
app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id).then(contact => {
        if (contact) {
            response.json(contact.toJSON())
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

/*
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
*/

//Update existing person number by id
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const contact = {
        name: body.name,
        number: body.number
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
        .then(updatedNote => {
            response.json(updatedNote.toJSON())
        })
        .catch(error => next(error))
})


//Delete person by id
app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
//persons = persons.filter(person => person.id !== id)



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectID') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'ValidationError' && error.kind == 'unique') {
        return response.status(400).send({ error: 'duplicate name' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})