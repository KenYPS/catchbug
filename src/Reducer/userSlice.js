import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { service } from 'api'

export const fetchLineLogout = createAsyncThunk(
  'fetchLineLogout',
  async () => {
  return service.post('/logout').then(({ result }) => {
  return result
  })
})
const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    account: '',
    name: '',
    accessToken: localStorage.getItem('accessToken'),
    idToken: localStorage.getItem('idToken'),
  },
  reducers: {
    setUserDetail(state, action) {
      state.account = action.payload
    },
    setToken(state, action) {
      state.accessToken = action.payload.accessToken
      state.idToken = action.payload.idToken
    },
  },
  extraReducers: {
    [fetchLineLogout.fulfilled]: (state, action) => {
      state.accessToken = ''
      state.idToken = ''
      state.account = ''
    },
  },
})

export const selectUser= (state) => state.user

export const { setUserDetail, setToken } = userSlice.actions

export default userSlice.reducer
