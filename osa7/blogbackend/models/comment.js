const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

/**
 * MONGOOSE SCHEMA FOR COMMENT
 */
const commentSchema = mongoose.Schema({
    comment: String,
    blogId: String,
    blog: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Blog'
    }
})

//DELETE _id and __v from returned JSON
commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

commentSchema.plugin(uniqueValidator)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment