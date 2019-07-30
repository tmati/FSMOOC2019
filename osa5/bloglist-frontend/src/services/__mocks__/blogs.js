
const blogs = [
  {
    title: 'Simple testing blog',
    author: 'James Bond',
    likes: 15,
    url: '007.org',
    user: {
      name: 'James Bond'
    }
  }
]


const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll }