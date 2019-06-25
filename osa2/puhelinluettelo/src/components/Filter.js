import React from 'react'

const Filter = ({ persons, searchFilter, handleChange }) => {
    return (
        <div>
            filter shown with <input value={searchFilter} onChange={handleChange} />
        </div>
    )
}
export default Filter