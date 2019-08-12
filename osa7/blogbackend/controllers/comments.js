const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

/**
 * GET ALL comments
 */
commentsRouter.get('/comments', async (request, response, next) => {
    const comments = await Comment.find({}).populate('blog', { comment:1, blogId:1})
    response.json(comments.map(comment => comment.toJSON()))
})

/**
 * POST COMMENT TO BLOG
 */
commentsRouter.post('/:id/comments', async(request, response, next) => {
    try {
    const body = request.body

    const blog = await Blog.findById(body.blogId)
    
    //COMMENT ATTRIBUTES
    const comment = new Comment({
        comment: body.comment,
        blogId: body.blogId,
        blog: blog._id
    })
    //SAVE AND ERROR CHECK
    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()
    response.json(savedComment.toJSON())
} catch (exception) {
    next(exception)
}

})

module.exports = commentsRouter