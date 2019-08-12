const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

  beforeEach(async () => {
      await Blog.remove({})
      console.log('DB CLEAR')

      const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))

      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
  })

test('blogs are returned as json', async () => {
    console.log('started tests')
  await api
    .get('/api/blogs')
    .expect(200)
})

test('All blogs will return', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('The first blog is about APIs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(blog => blog.title)
  
    expect(contents).toContain('Understanding APIs')
  })

  test('A valid blog can be added ', async () => {
      const newBlog = {
          title:'A test blog. Hope this works!',
          author:'Topi Matikainen',
          url:'www.abcdefghi.com',
          likes:0,
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const finalBlogs = await helper.blogsInDb()
      expect(finalBlogs.length).toBe(helper.initialBlogs.length +1)

      const contents = finalBlogs.map(blog => blog.title)
      expect(contents).toContain('A test blog. Hope this works!')
  })

  test('A blog without any content cannot be added', async () => {
      const newBlog = {
        likes:0
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

      const finalBlogs = await helper.blogsInDb()

      expect(finalBlogs.length).toBe(helper.initialBlogs.length)
  })


  test('4.12* A blog without title cannot be added', async () => {
    const newBlog = {
      author:'Topi Matikainen',
      url:'notitle.com',
  }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const finalBlogs = await helper.blogsInDb()

    expect(finalBlogs.length).toBe(helper.initialBlogs.length)
})


test('4.12* A blog without url cannot be added', async () => {
  const newBlog = {
    title:'No url in blogs is bad',
    author:'Topi Matikainen',
}

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const finalBlogs = await helper.blogsInDb()

  expect(finalBlogs.length).toBe(helper.initialBlogs.length)
})

  test('a single blog can be viewed', async () => {
      const initialBlogs = await helper.blogsInDb()

      const viewedBlog = initialBlogs[0]

      const resultBlog = await api
      .get(`/api/blogs/${viewedBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(resultBlog.body.title).toEqual(viewedBlog.title)
  })

  test('a blog can be deleted', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogTodelete = initialBlogs[0]

    await api
    .delete(`/api/blogs/${blogTodelete.id}`)
    .expect(204)

    const finalBlogs = await helper.blogsInDb()

    expect(finalBlogs.length).toBe(helper.initialBlogs.length - 1)

    const contents = finalBlogs.map(blog => blog.title)

    expect(contents).not.toContain(blogTodelete.title)
  })

  test('4.9*: blogs identified by id field', async () => {
    const initialBlogs = await helper.blogsInDb()

    const inspectedBlog = initialBlogs[0]

    expect(inspectedBlog.id).toBeDefined()
  })

  test('4.11* new blog likes automatically set to 0 if not defined on creation', async () => {
    const newBlog = {
      title:'Tests are important!',
      author:'Topi Matikainen',
      url:'www.abcdefghi.com',
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(200)

const finalBlogs = await helper.blogsInDb()
  const contents = finalBlogs.map(blog => blog.likes)
  expect(contents[contents.length-1]).toBe(0)
  })

  //USER TESTS HERE

  const User = require('../models/user')

  describe('one user already in database', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const user = new User({ username: 'root', password: 'sekret'})
      await user.save()
    })

    test('cannot create another user with existing username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)

    })

    test('new user creation successful', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'tmati',
        name: 'Topi Matikainen',
        password: 'verysecret'
      }

      await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect (usersAtEnd.length).toBe(usersAtStart.length +1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })

  test('no user creation if no password given', async () => {
    const usersAtStart = await helper.usersInDb()

    const nopasswordUser = {
      username: 'nopwd',
      name: 'No Pass',
    }

    const result = await api
    .post('/api/users')
    .send(nopasswordUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('no password given')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)


  })

  test('no user creation if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const nopasswordUser = {
      username: 'nopwd',
      name: 'No Pass',
      password: 'pw'
    }

    const result = await api
    .post('/api/users')
    .send(nopasswordUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)


  })

  test('no user creation if username too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const nopasswordUser = {
      username: 'su',
      name: 'Short Namer',
      password: 'coolpass'
    }

    const result = await api
    .post('/api/users')
    .send(nopasswordUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` (`su`) is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)


  })


afterAll(() => {
  mongoose.connection.close()
})