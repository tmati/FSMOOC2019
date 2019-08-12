const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/**
 *  GET ALL. Populate comments and users.
 */
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', {username:1, name:1}).populate('comments', {comment:1, blogId: 1})
  response.json(blogs.map(blog => blog.toJSON()))


})

/**
 * POST NEW. Add logged in user data.
 */
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})  
  }

  const user = await User.findById(decodedToken.id)

  /**
   * New blog attributes. Save and check errors.
   */
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

/**
 * GET SINGLE BLOG BY ID.
 */
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

/**
 * DELETE BY ID
 */
blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    } else {
      response.status(401).json({error: 'you are not the author.'})
    }
  } catch (exception) {
    next(exception)
  }
})

/**
 * UPDATE
 */
//4.14* Checked in Postman
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(204)
  } catch (exception) {
    next(exception)
  }
})


module.exports = blogsRouter