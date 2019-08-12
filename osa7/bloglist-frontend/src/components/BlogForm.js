import React from 'react'
import PropTypes from 'prop-types'

//FORM COMPONENT FOR ADDING NEW BLOGS
const BlogForm = ({ addBlog, newTitle, newAuthor, newUrl, handleAuthorChange,handleTitleChange, handleUrlChange }) => {
  return(
    <div className='blogInput'>
      <form onSubmit={addBlog}>
        <div>
        title: <input key="titleInput" value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
        author: <input key="authorInput" value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
        url: <input key="urlInput" value={newUrl} onChange={handleUrlChange} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  newtitle: PropTypes.string,
  newAuthor: PropTypes.string,
  newUrl: PropTypes.string,
  handleAuthorChange: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired
}

export default BlogForm