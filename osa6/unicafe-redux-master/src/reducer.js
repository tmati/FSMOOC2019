const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const goodIncrement = {
        good: state.good+1,
        ok:state.ok,
        bad:state.bad
      }
      return goodIncrement
    case 'OK':
        const okIncrement = {
          good: state.good,
          ok:state.ok+1,
          bad:state.bad
        }
        return okIncrement
    case 'BAD':
        const badIncrement = {
          good: state.good,
          ok:state.ok,
          bad:state.bad+1
        }
        return badIncrement
    case 'ZERO':
      return initialState
    default: return state
  }
}

export default counterReducer