const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: "Understanding APIs",
      author: "Topi Matikainen",
      url: "www.23424242.org",
      likes: 0,
      __v: 0
    },
    {
      title: "Lego Robot Project",
      author: "Topi Matikainen",
      url: "www.23424242/lrp.org",
      likes: 5,
      __v: 0
    }]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Hope to not see this' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}