import React from 'react'

import { reducer as stateReducer } from './store'

const combineReducer = (reducers) => {
  const reducerKeys = Object.keys(reducers)
  const objInitState = {}

  reducerKeys.forEach((key) => {
    const initState = reducers[key](undefined, { type: '' })
    if (initState === 'undefined') {
      throw new Error(`${key} does not return state.`)
    }
    objInitState[key] = initState
  })

  return (state, action) => {
    if (action) {
      reducerKeys.forEach((key) => {
        const previousState = objInitState[key]
        objInitState[key] = reducers[key](previousState, action)
      })
    }
    return { ...objInitState }
  }
}

const reducer = combineReducer({
  stateReducer
})
const initialState = reducer()
const ContextStore = React.createContext(initialState)

export { initialState, ContextStore, reducer }
