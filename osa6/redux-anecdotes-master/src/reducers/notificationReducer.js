const notificationReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.data.notification
        case 'CLEAR':
            return null
        default:
            return state
    }
}
export const notificationChange = (notification, timeout) => {
    return dispatch => {
        dispatch({type: 'SET_NOTIFICATION',
        data: {
            notification:notification
        }
    });setTimeout(() => {
        dispatch({
        type:'CLEAR'
        })
    },timeout * 1000)
}
}

export default notificationReducer