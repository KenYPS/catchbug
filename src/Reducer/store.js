import { fromJS } from 'immutable'

const SET_DATA = 'SET_DATA'

const initialState = fromJS({
    theme: 'main',
    activeNav:'',
    searchValue:'',
    account:'',
    naem:'',
    menuList: [{
        name: 'Costco',
    }],
    // fetch data
    itemList:[]
})

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATA:
            return state.set(action.path, action.value)
        default:
            return state
    }
}

export {
    initialState,
    reducer,
}