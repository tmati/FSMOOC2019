import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

//AUTH
const setToken = newToken => {
  token =`bearer ${newToken}`
}

//GET ALL BLOGS
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//CREATE NEW BLOG
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// UPDATE EXISTING
const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

//DELETE ENTRY
const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data )
}

export default { getAll, create, update, setToken, remove }