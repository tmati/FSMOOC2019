
const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_FILTER':
        return action.filter
        case 'INIT_FILTER':
            return action.data.filter
        default:
        return state
    }
}

export const initializeFilter = (filter) => {
    return async dispatch => {
    dispatch({type: 'INIT_FILTER',
        data: filter,
})
    }
}

export const filterChange = filter => {
    return async dispatch => {
    dispatch ({type: 'SET_FILTER', data: {
        filter:''}})
    }
}

export default filterReducer