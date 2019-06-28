import React from 'react'

const Person = ({person, handleRemoval}) => {
    return (
        <div>{person.name} {person.number} <button onClick={handleRemoval}>delete</button></div>
    )
}

export default Person