import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { service } from 'api'

export const fetchItemList = createAsyncThunk(
  'fetchItemList',
  async (params) => {
    return service.get('/getList', { params }).then(({ result }) => {
      return result
    })
  }
)

export const fetchAddList = createAsyncThunk('fetchAddList', async (data) => {
  return service.put('/addItem', data).then(({ result }) => {
    return result
  })
})

export const fetchDeleteList = createAsyncThunk('fetchDeleteList', async (data) => {
  return service.put('/deleteItem', data).then(({ result }) => {
    return result
  })
})

const dataSlice = createSlice({
  name: 'userSlice',
  initialState: {
    theme: 'main',
    searchValue: '',
    menuList: [
      {
        name: 'Costco',
      },
    ],
    // fetch data
    itemList: [],
  },
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload
    }
  },
  extraReducers: {
    [fetchItemList.fulfilled]: (state, action) => {
      state.itemList = action.payload
    },
    [fetchAddList.fulfilled]: (state, action) => {
      state.searchValue = ''
    },
    [fetchDeleteList.fulfilled]: (state, action) => {
      state.itemList = action.payload
    }
  },
})

export const selectData = (state) => state.data

export const { setSearchValue } = dataSlice.actions

export default dataSlice.reducer
