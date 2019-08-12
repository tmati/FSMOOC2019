const mongoose = require('mongoose')

/**
 * MONGOOSE BLOG SCHEMA
 */
const blogSchema = new mongoose.Schema({
    title: {type: String,
    required:true,
    },
    author: String,
    url: {type:String,
      required:true,
    },
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'
      }],
})

// DELETE _id and __v fields from returned JSON
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)