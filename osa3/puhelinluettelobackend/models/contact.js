const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {useNewUrlParser: true})
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to mongoDB:', error.message)
    })


//SCHEMA FOR CONTACT MODEL
const contactSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength: 3,
        required:true,
        unique:true,
    },
    number: {
        type:String,
        minlength:8,
        required:false,
    }
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        }
    })

    module.exports = mongoose.model('Contact', contactSchema)