import React from 'react'

//USER INFORMATIN COMPONENT
const User = ({ user }) => {
  //USER BLOG LISTINGS
  const blogList = () => user.blogs.map( blog =>
    <li key = {blog.id} className="blogView">
      {blog.title}
    </li>)
  if (user === undefined) {
    return null
  }
  return (
    <div>
      <h1>{user.name}</h1>
      <h2> added blogs </h2>
      {blogList()}
    </div>
  )
}

export default User