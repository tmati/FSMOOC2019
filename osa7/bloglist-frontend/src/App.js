import React from 'react'
import { useState, useEffect } from 'react'
import blogservice from './services/blogservice'
import loginService from './services/login'
import commentService from './services/commentservice'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import { useField } from './hooks'
import {
  BrowserRouter as Router,
  Route, Link, Redirect
} from 'react-router-dom'
import User from './components/User'
import { Container, Menu, Message } from 'semantic-ui-react'


//ALL USERS LISTED (7.7)
const usersList = (props) => props.map(user =>
  <li key = {user.id} className='userList'>
    <Link to={`/users/${user.id}`}>{user.name}: {user.blogs.length} blogs</Link>
  </li>)

//COMPONENT FOR HOLDING LIST OF USERS ABOVE
const Users = (props) => {
  return (
    <div>
      <h2>blogs created</h2>
      <h3>click on username to see their blogs</h3>
      {usersList(props.users)}
    </div>
  )
}

//LANDING VIEW
const Home = (props) => {
  return(
    <div key='homeDiv' >
      {props.blogForm()}
      <h2 key='homeH2'>Blog Collection</h2>
      <ul key ='homeUl' className ="blogList">{props.blogList()}</ul>

    </div>
  )
}

//FOR VIEWING SINGLE BLOG AND COMMENTS
const BlogView = ({ foundblog, hitLike, removeblog, addComment, comment, commentList }) => {
  if (foundblog === undefined) {
    return null
  }
  return (
    <div className="blogView">
      <div>
        <b>{foundblog.title}</b>, by <i>{foundblog.author}</i>
        <div>{foundblog.url}</div>
        <div>{foundblog.likes} likes <button onClick={() => hitLike(foundblog)}> like</button> </div>
        <div>added by {foundblog.user.name}</div>
        <button onClick={() => removeblog(foundblog)}>delete</button>
        <h3>Comments</h3>
        <form onSubmit={() => addComment(foundblog)}>
          <div>
            <input key="commentInput" value={comment.value} onChange={comment.onChange}/>
          </div>
          <button type ="submit">add comment</button>
        </form>
        {commentList(foundblog)}
      </div>
    </div>
  )
}

//SINGLE USER VIEW (7.8)
const UserView = (props) => {
  if (props.founduser === undefined) {
    return null
  }
  return (
    <div>
      <User user={props.founduser}/>
    </div>
  )
}

//TOP NAVBAR WITH ROUTER (7.10)
const MainMenu = (props) => {
  return (
    <div key='main1'>
      <Router key='mainRouter'>
        <div key='main2'>
          <div key='main3'>
            <Menu inverted>
              <Menu.Item link>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item link>
                <Link to="/users">  Users</Link>
              </Menu.Item>
              <Menu.Item link>
                {props.user === null ? props.loginForm() :
                  <div> <p className="loggedinP">Logged in as {props.user.name} <button onClick={() => props.handleLogout()}>logout</button></p>
                    <User user={props.founduser}/>
                  </div>
                }
              </Menu.Item>
            </Menu>
          </div>
          {(props.message &&
              <Message success>
                {props.message}
              </Message>)}
          {props.errorMessage &&
              <Message Error>
                {props.errorMessage}
              </Message>}
          <h1>Blogs</h1>
          <Route path="/users" render={() => <Users users={props.users}/> } />
          <Route exact path="/" component={() => <Home blogForm={props.blogForm} blogList={props.blogList} />} />
          <Route path="/users/:id" render={({ match }) =>
            <UserView founduser={props.users.find(user => user.id === (match.params.id))} /> }/>
          <Route path="/blogs/:id" render={  ({ match }) => props.blogs.find(blog => blog.id === (match.params.id)) ?
            <BlogView removeblog={props.removeblog} comment={props.comment} commentList={props.commentList} addComment={props.addComment} hitLike={props.hitLike} foundblog={props.blogs.find(blog => blog.id === (match.params.id)) } />  : <Redirect to="/"/> }  />
        </div>
      </Router>
    </div>
  )
}

const App = () => {
  const uname = useField('text')
  const pwd = useField('text')
  const blogtitle = useField('text')
  const blogauthor = useField('text')
  const blogurl = useField('text')
  const comment = useField('text')
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState(null)

  //USEEFFECT HOOK INITIALIZER
  useEffect(() => {
    blogservice.getAll().then(initialBlogs => {
      setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes))
      loginService.getUsers().then(foundUsers => {setUsers(foundUsers.data)})
    })
    const loggedInJSON = window.localStorage.getItem('loggedIn')
    if (loggedInJSON) {
      const user = JSON.parse(loggedInJSON)
      setUser(user)
      blogservice.setToken(user.token)
    }
  }, [])

  //SHOW COMMENTS FOR BLOG(7.10)
  const commentList = (foundblog) => {
    return(
      foundblog.comments.map (comment =>
        <li key = {comment.id}>
          {comment.comment}
        </li>)
    )}

  //HANDLER FOR ADDING NEW COMMENTS (7.12)
  const addComment = async (foundblog) => {
    const newComment = {
      comment: comment.value,
      blogId: foundblog.id,
    }
    await commentService.create(foundblog.id, newComment)
  }

  //FORM FOR LOGIN INPUTS
  const loginForm = () => {
    const cleanpwd = removeprop(pwd, 'reset')
    const cleanuname = removeprop(uname, 'reset')
    return (
      <form onSubmit={handleLogin}>
        <div>
            username
          <input data-cy="username" key="usernameInput" id='username' {...cleanuname} />
        </div>
        <div>
            password
          <input data-cy="password" key="passwordInput" id='password' {...cleanpwd} />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  //FORM FOR ADDING NEW BLOG WITH VISIBILITY TOGGLE
  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div className='blogForm'>
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
          <button className="cancelBtn" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  //REMOVE PROPS
  const removeprop = (obj, propname) => {
    let { [propname]: _, ...result } = obj
    return result
  }

  //CLICK HANDLER FOR ADDING NEW BLOG
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogtitle.value,
      author: blogauthor.value,
      url: blogurl.value
    }
    //CREATE NEW BLOG
    blogservice.create(blogObject)
    //APPEND BLOG STATE WITH NEW ENTRY
      .then(data => {
        setBlogs(blogs.concat(data))
        //SET NOTIFICATION FOR 5 SECONDS
        setMessage(`New blog added: "${blogtitle.value}" by ${blogauthor.value}!`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        //RESET FORM FIELDS
        blogtitle.reset()
        blogauthor.reset()
        blogurl.reset()
      })
  }

  //LIKE BUTTON EVENT
  const hitLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      user: blog.user,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    //UPDATE BLOG LIKES ON SERVER
    blogservice.update(blog.id, updatedBlog)
    blogs.map(oldblogs => oldblogs.id !== blog.id ? oldblogs : blog)
  }

  //DELETE BLOG FROM SERVER AND CLIENT VIEW
  const removeblog = (blog) => {
    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (result) {
      blogservice.remove(blog.id)
      let filtered = blogs.filter(e => e.title !== blog.title)
      setBlogs(filtered)
    }
  }

  //LOGIN - SAVED TO BROWSER LOCALSTORAGE
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
      //SHOW ERROR MESSAGE
      setErrorMessage('Bad credentials! Try again!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  //LOGOUT HANDLER. Clears localstorage and reloads the window.
  const handleLogout = (event) => {
    window.localStorage.clear()
    window.location.reload()
  }

  //LIST OF ALL BLOG COMPONENTS
  const blogList = () => blogs.map(blog =>
    <Blog
      hitlike={hitLike}
      removeblog={removeblog}
      key={blog.id}
      blog={blog} />
  )

  return (
    <Container key="main">
      <MainMenu blogtitle={blogtitle} blogurl={blogurl} blogauthor={blogauthor} addBlog={addBlog} setBlogFormVisible={setBlogFormVisible} blogFormVisible={blogFormVisible} errorMessage={errorMessage} message={message} user={user} blogs={blogs} users={users} commentList={commentList} comment={comment} addComment={addComment} hitLike={hitLike} loginForm={loginForm} handleLogout={handleLogout} blogList={blogList} blogForm={blogForm} removeblog={removeblog}/>
    </Container>

  )
}

export default App
