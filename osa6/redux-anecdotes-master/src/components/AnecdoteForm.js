import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer';

const NewAnecdote = (props) => {
    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.notificationChange(`added '${content}'`,5)
        props.createAnecdote(content)

    }

    return (<form onSubmit={addAnecdote}>
        <input name='anecdote'></input>
        <button type ="submit">add</button>
    </form>
        )
}

const ConnectedNewAnecdote = connect(null, { createAnecdote, notificationChange } )(NewAnecdote)
export default ConnectedNewAnecdote