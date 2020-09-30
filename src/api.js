import { useEffect, useContext } from 'react'
import firebase from '@firebase/app'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { fromJS } from 'immutable'
import get from 'lodash/get'
import {  useLocation } from "react-router-dom"

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
    firebase.auth().signOut()
    localStorage.removeItem('token')
    dispatch({ type: 'SET_DATA', path: 'account', value: '' })
    dispatch({ type: 'SET_DATA', path: 'itemList', value: [] })
}



// -----------------------------------------
// Axios

export const googleLogin = axios.create()

googleLogin.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        config.headers.Token = token
        return config
    },
    error => {
        return Promise.reject(error)
    }
)   
googleLogin.interceptors.response.use(
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
export const apiGetList = (params, dispatch) => googleLogin.get('/getList', { params }).then(({  result}) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result})
})

// add list
export const apiAddList = (data, dispatch) => googleLogin.put('/addList', data).then(({ error_code, result }) => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value: '' })
})


// remove list
export const apiDeleteList = (data,dispatch) =>googleLogin.put('/deleteList', data).then(({ result }) => {
        dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
    })





// line 


export const useLineLoggingCheck =()=>{
    const afterQuery = new URLSearchParams(useLocation().search)
    const query = new URLSearchParams(window.location.search)
    const checkCode = query.get('code')
    const code = afterQuery.get('code')
    useEffect(()=>{
        if (checkCode && !code) {
            console.log(123);
            window.location.href = window.location.origin + '/#/' + window.location.search
        }
        if (code) {
            console.log(code);
            apiLineAuth({code})
        }
    },[checkCode, code])
}

export const apiLineLogin = ()=>{
    let URL = `https://access.line.me/oauth2/v2.1/authorize?`
    URL += 'response_type=code'
    URL += '&client_id=1654992288'
    URL += '&redirect_uri=https://845f408d0a68.ngrok.io/'
    URL += '&state=123'
    URL += '&scope=openid%20profile';
    window.location.href = URL
    
}

const apiLineAuth = (data)=>axios.post('/line/login', data)