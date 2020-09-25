import { useEffect, useContext } from 'react'
import firebase from '@firebase/app'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { fromJS } from 'immutable'
import get from 'lodash/get'

import '@firebase/auth'
import '@firebase/database'

import { abstractAccount } from 'Utils'

// firebase config
import config from './config'

// ifirebase
firebase.initializeApp(config)

function logginedDispatch(user, setModalOpen, dispatch, site) {
    const account = abstractAccount(user.email)
    user.getIdToken().then(function (token) {
        localStorage.setItem('token', token) 
        apiGetList({ site }, dispatch)
    });
    setModalOpen(false)
    dispatch({ type: 'SET_DATA', path: 'account', value: account })
}

// verify isLogged in
export const useApiVerifyUser = (setModalOpen) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                logginedDispatch(user, setModalOpen, dispatch, site)
            } else {
                setModalOpen(true)
            }
        })
    }, [dispatch, setModalOpen, site])

}

//  google account login
export const useApiGoogleLogin = (setModalOpen) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const provider = new firebase.auth.GoogleAuthProvider()
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    return () => new firebase.auth().signInWithRedirect(provider).then(res => {
        const user = res.user
        logginedDispatch(user, setModalOpen, dispatch, site, res)
    })
}

// log out
export const apiLogOut = (dispatch) => {
    localStorage.removeItem('token')
    dispatch({ type: 'SET_DATA', path: 'account', value: '' })
    return firebase.auth().signOut()
}


// email login
// export const useApiEmailLogin = (setModalOpen) => {
//     const { state: { stateReducer }, dispatch } = useContext(ContextStore)
//     const site = stateReducer.getIn(['menuList', 0, 'name'])
//     return (account, password) => firebase.auth().signInWithEmailAndPassword(account, password).then(res => {
//         const user = res.user
//         apiGetData({ account, site, dispatch })
//         logginedDispatch(user, setModalOpen, dispatch)
//     }).catch(res => {
//         alert(res)
//         return res
//     })
// }



// -----------------------------------------
// Axios

export const service = axios.create()

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        config.headers.Token = token
        return config
    },
    error => {
        return Promise.reject(error)
    }
)   
service.interceptors.response.use(
    res => {
        const result = fromJS(get(res, ['data', 'result']))
        const error_code = get(res, ["data", "error_code"])
        const error_msg = get(res, ["data", "error_msg"])
        if (error_code !== 1) alert(error_msg)
        return { result, error_code, error_msg }
    },
    error => {
        alert(error)
        return Promise.reject(error)
    }
)

// get list
export const apiGetList = (params, dispatch) => service.get('/getList', { params }).then(({  result}) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result})
})

// add list
export const apiAddList = (data, dispatch) => service.put('/addList', data).then(({ error_code, result }) => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value: '' })
})


// remove list
export const apiDeleteList = (data,dispatch) =>service.put('/deleteList', data).then(({ result }) => {
        dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
    })

