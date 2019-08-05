import React from 'react'

const Anecdote = ({anecdote, handleClick}) => {
    return (<div>
        {anecdote.content}
        <p> has {anecdote.votes} votes</p> <button onClick={handleClick}>vote</button>
    </div>)
}

export default Anecdote