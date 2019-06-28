import React from 'react'

const Persons = ({rows}) => {
    return (
        <div>
        {rows()}
      </div>
    )
}


export default Persons