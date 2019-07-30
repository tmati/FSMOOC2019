import React from 'react'
import PropTypes from 'prop-types'

const Errorbox = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

Errorbox.propTypes = {
  message: PropTypes.string
}
export default Errorbox