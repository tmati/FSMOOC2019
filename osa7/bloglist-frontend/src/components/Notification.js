import React from 'react'
import PropTypes from 'prop-types'


//NOTIFICATION MESSAGE LOGIC

const Notification = ({ message }) => {
  //Don't show by default
  if (message === null) {
    return null
  }

  //Show when message exists
  return (
    <div className="success">
      {message}
    </div>)
}

Notification.propTypes = {
  message: PropTypes.string
}

export default Notification