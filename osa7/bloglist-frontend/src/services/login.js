import axios from 'axios'
const baseUrl ='/api/login'
const userUrl ='/api/users'

//LOGIN
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

//GET ALL USERS
const getUsers = () => {
  const userJSON = axios.get(userUrl)
  return userJSON

}

export default { login, getUsers }