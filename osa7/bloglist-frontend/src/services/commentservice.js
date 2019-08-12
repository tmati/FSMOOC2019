import axios from 'axios'
const baseUrl = '/api/blogs'

//GET ALL COMMENTS
const getAll = () => {
  const request = axios.get(`${baseUrl}/comments`)
  return request.then(response => response.data)
}

//CREATE NEW COMMENT
const create = async (id, newObject) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, newObject)
  return response.data
}

export default { getAll, create }
