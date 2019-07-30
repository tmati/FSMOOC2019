import React from 'react'
import { useState, useEffect } from 'react'
import blogservice from './services/blogservice'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Errorbox from './components/Error'
import BlogForm from './components/BlogForm'
import { useField } from './hooks'

const App = () => {
  const uname = useField('text')
  const pwd = useField('text')
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const blogtitle = useField('text')
  const blogauthor = useField('text')
  const blogurl = useField('text')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [information, setInformation] = useState(null)

  useEffect(() => {
    blogservice.getAll().then(initialBlogs => {
      setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem('loggedIn')
    if (loggedInJSON) {
      const user = JSON.parse(loggedInJSON)
      setUser(user)
      blogservice.setToken(user.token)
    }
  }, [])

  const blogList = () => blogs.map(blog =>
    <Blog
      hitlike={hitLike}
      removeblog={removeblog}
      key={blog.id}
      blog={blog} />
  )

  const removeprop = (obj, propname) => {
    let { [propname]: _, ...result } = obj
    return result
  }

  const loginForm = () => {
    const cleanpwd = removeprop(pwd, 'reset')
    const cleanuname = removeprop(uname, 'reset')
    return (
      <form onSubmit={handleLogin}>
        <div>
        username
          <input {...cleanuname} />
        </div>
        <div>
        password
          <input {...cleanpwd} />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogtitle.value,
      author: blogauthor.value,
      url: blogurl.value
    }

    blogservice.create(blogObject)
      .then(data => {
        setBlogs(blogs.concat(data))
        setInformation(`New blog added: "${blogtitle.value}" by ${blogauthor.value}!`)
        setTimeout(() => {
          setInformation(null)
        }, 5000)
        blogtitle.reset()
        blogauthor.reset()
        blogurl.reset()
      })

  }

  const hitLike = (blog) => {
    const updatedBlog = {
      title: blog.title,
      user: blog.user,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    blogservice.update(blog.id, updatedBlog)
    blog.likes++
  }

  const removeblog = (blog) => {
    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (result) {
      blogservice.remove(blog.id)
      let filtered = blogs.filter(e => e.title !== blog.title)
      setBlogs(filtered)
    }
  }


  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}> Create a new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            addBlog={addBlog}
            newTitle={blogtitle.value}
            newAuthor={blogauthor.value}
            newUrl={blogurl.value}
            handleAuthorChange={blogauthor.onChange}
            handleUrlChange={blogurl.onChange}
            handleTitleChange={blogtitle.onChange}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const username = uname.value
      const password = pwd.value
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedIn', JSON.stringify(user)
      )

      uname.reset()
      pwd.reset()
      blogservice.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('Bad credentials! Try again!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.clear()
    window.location.reload()
  }

  return (
    <div>

      <h1>Blogs</h1>
      <Notification message={information} />
      <Errorbox message={errorMessage} />

      <h2>Login</h2>

      {user === null ? loginForm() :
        <div> <p className="loggedinP">Logged in as {user.name} <button onClick={() => handleLogout()}>logout</button></p>
          {blogForm()}
          <h2>Blog Collection</h2>

          <ul className ="bloglist">{blogList()}</ul>
        </div>
      }
    </div>
  )
}

export default App
