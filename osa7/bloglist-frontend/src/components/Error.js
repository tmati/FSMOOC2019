import React from 'react'
import PropTypes from 'prop-types'

//ERROR MESSAGE LOGIC
const Errorbox = ({ message }) => {
  //Don't show empty
  if (message === null) {
    return null
  }
  return (
    //Show if has content
    <div className="error">
      {message}
    </div>
  )
}

Errorbox.propTypes = {
  message: PropTypes.string
}
export default Errorbox