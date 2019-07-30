import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, hitlike, removeblog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} onClick={toggleVisibility} className="defaultContent">
        <b>{blog.title}</b>, by <i>{blog.author}</i>
      </div>
      <div style={showWhenVisible} onClick={toggleVisibility} className="hiddenContent">
        <b>{blog.title}</b>, by <i>{blog.author}</i>
        <div>{blog.url}</div>
        <div>{blog.likes} likes <button onClick={() => hitlike(blog)}> like</button> </div>
        <div>added by {blog.user.name}</div>
        <button onClick={() => removeblog(blog)}>delete</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  hitlike: PropTypes.func.isRequired,
  removeblog: PropTypes.func.isRequired
}

export default Blog