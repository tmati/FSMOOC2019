import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Popular = ({ptsArr}) => {

    //Look for highest voted
    const FindPopular = () => {
        return Math.max.apply(Math, ptsArr);  
    }

    //Index of highest voted
    const maxIndex = ptsArr.indexOf(Math.max(...ptsArr));

    //Checks if zero votes given
    if(FindPopular() === 0) {
        return (<div>
            <h1>Most voted anecdote</h1>
            <p>The anecdote with the highest number of votes will be shown here. Cast your vote now!</p>
        </div>)
    } else {

    return (
        <div>
        <h1>Most voted anecdote</h1>
        {anecdotes[maxIndex]}
        <p>{FindPopular()} votes</p>
        </div>
    )
    }
}

const App = (props) => {
    const [selected, setSelected] = useState(0)
    const [points, setPoints] = useState(Array.apply(null, new Array(6)).map(Number.prototype.valueOf, 0))
    let random = 0

    //Unable to get the same anecdote twice in a row
    const RollRandom = () => {
        while (random === selected) {
            random = Math.floor((Math.random() * Math.floor(anecdotes.length)))
        }
        return random;
    }

    const Vote = () => {
        console.log(points)
        console.log('Voting')
        const copy = [...points];
        copy[selected] += 1;
        setPoints(copy);
        console.log(copy)
    }

    return (
        <div>
            {props.anecdotes[selected]}
            <p>Has {points[selected]} votes</p>
            <br></br>
            <button onClick={Vote}>vote</button>
            <button onClick={() => setSelected(RollRandom)}>Next anecdote</button>
            <Popular ptsArr={points}/>
        </div>
    )
    
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)