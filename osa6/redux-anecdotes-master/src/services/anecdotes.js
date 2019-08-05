import axios from 'axios'

const url = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(url)
    return response.data
}

const createNew = async (content) => {
    const object = { content, votes:0 }
    const response = await axios.post(url, object)
    return response.data
}

const addvote = async (id) => {
    const upvoted = await axios.get(`${url}/${id}`, )
    upvoted.data.votes++
    await axios.put(`${url}/${id}`, upvoted.data)
}

export default { getAll, createNew, addvote }
