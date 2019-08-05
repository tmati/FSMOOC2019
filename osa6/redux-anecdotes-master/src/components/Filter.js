import React from 'react'
import {filterChange} from '../reducers/filterReducer'
import { connect } from 'react-redux';

const Filter = (props) => {
  const handleChange = (event) => {
    props.filterChange(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      Search from anecdotes <input onChange={handleChange} />
    </div>
  )
}

export default connect(null, { filterChange })(Filter)