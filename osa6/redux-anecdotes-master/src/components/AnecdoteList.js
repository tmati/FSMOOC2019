import React from 'react'
import { connect } from 'react-redux'
import Anecdote from './Anecdote'
import { vote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer';


const AnecdoteList = (props) => {
    console.log(props)
    return (
        <div>
            {props.visibleAnecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => {
                        props.vote(anecdote.id)
                        props.notificationChange(`Voted ${anecdote.content}`, 5)
                    }}
                />)}
        </div>
    )
}


const filteredAnecdotes = (props) => {
    if(props.filter === null) {
        console.log(props)
        console.log('NULL', props.filter)
        return props.anecdotes
    }
    const filtered = props.anecdotes.filter(anecdote => {
        console.log('filter', props.filter)
        console.log(props.anecdotes, 'anecdotes')
        return anecdote.content.toLocaleLowerCase().includes(props.filter.toLocaleLowerCase())
    })
    return filtered
}


const mapStateToProps = (state) => {
    return {
        visibleAnecdotes: filteredAnecdotes(state),
    }
}

const mapDispatchToProps = {
    vote,
    notificationChange
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)