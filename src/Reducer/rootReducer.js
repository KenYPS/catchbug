import { combineReducers } from '@reduxjs/toolkit'
import data from './dataSlice'
import user from './userSlice'

const rootReducer = combineReducers({
  data,
  user
})
export default rootReducer