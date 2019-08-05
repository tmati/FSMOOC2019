import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import anecdotereducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterReducer from './reducers/notificationReducer' 

const reducer = combineReducers({
    anecdotes:anecdotereducer,
    notification: notificationReducer,
    filter:filterReducer
  })

  const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

  export default store