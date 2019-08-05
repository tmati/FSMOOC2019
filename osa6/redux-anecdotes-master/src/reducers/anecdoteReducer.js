import anecdoteService from '../services/anecdotes'


const anecdotereducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const found = state.find(anecdote => anecdote.id === action.data.id)
      found.votes = found.votes + 1
      const votedstate = state.map(anecdote => anecdote.id !== found.id ? anecdote : found).sort((a, b) => b.votes - a.votes)
      return votedstate
    case 'NEW_ENTRY':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data.anecdotes.sort((a, b) => b.votes - a.votes)
    default:
      return state
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ENTRY',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: {anecdotes:anecdotes, 
            filter:''}
    })
  }
}

export const vote = id => {
  return async dispatch => {
    anecdoteService.addvote(id)
    dispatch({
      type: 'VOTE',
      data: { id }
    })
  }
}

export default anecdotereducer