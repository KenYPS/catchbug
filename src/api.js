import { useEffect, useContext } from 'react'
import firebase from '@firebase/app'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { fromJS } from 'immutable'
import get from 'lodash/get'
import '@firebase/auth'
import '@firebase/database'
import qs from 'querystring'
import jwtDecoded from 'jwt-decode'

import { abstractAccount } from 'Utils'

// firebase config
import config from './config'

import line_login from './common/lineLogin'

// ifirebase
firebase.initializeApp(config)

function logginedDispatch(user, setModalOpen, dispatch, site) {
    const account = abstractAccount(user.email)
    user.getIdToken().then(function (token) {
        localStorage.setItem('token', token)
        apiGetList({ site }, dispatch)
    })
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

export const service = axios.create()

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token')
        const idtoken = localStorage.getItem('id_token')

        console.log(token)
        config.headers.token = token
        config.headers.idtoken = idtoken

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
        console.error(error)
        return Promise.reject(error)
    }
)

// get list
export const apiGetList = (params, dispatch) => service.get('/line/getList', { params }).then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
})

// add list
export const apiAddList = (data, dispatch) => service.put('/addList', data).then(({ error_code, result }) => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value: '' })
})


// remove list
export const apiDeleteList = (data, dispatch) => service.put('/deleteList', data).then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
})


// line 
export const useLineLoggingCheck = (setModalOpen, token) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    const query = new URLSearchParams(window.location.search)
    const code = query.get('code') || token
    const access_token = localStorage.getItem('access_token', '')

    useEffect(() => {
        if (access_token && !code) {
            service.defaults.headers.token = access_token
            apiLineAuth(setModalOpen, dispatch, site)
        } else if (code && !access_token) {
            apiLineLogin(setModalOpen, dispatch, site, code)
        }

    }, [access_token, code, dispatch, setModalOpen, site])

}

export const lineLogin = () => {
    let URL = `https://access.line.me/oauth2/v2.1/authorize?`
    URL += 'response_type=code'
    URL += `&client_id=${line_login.client_id}`
    URL += `&redirect_uri=${line_login.redirect_uri}`
    URL += '&state=123'
    URL += '&scope=profile%20openid%20email'
    window.location.href = URL
}

const apiLineAuth = (setModalOpen, dispatch, site) => service.post('/line/auth').then(({ result }) => {
    loggedinAction({ setModalOpen, dispatch, site })
})


const apiLineLogin = (setModalOpen, dispatch, site, code) => {
    let requestData = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: line_login.redirect_uri,
        client_id: line_login.client_id,
        client_secret: process.env.REACT_APP_apiKey
    }

    const data = qs.stringify(requestData)
    axios.post('https://api.line.me/oauth2/v2.1/token', data).then(res => {
        const { id_token, access_token } = res.data
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('id_token', id_token)
        loggedinAction({ setModalOpen, dispatch, site})
    }, err => {
        console.log(err.response.data)
    })
}

function loggedinAction({ dispatch, setModalOpen, site}) {
    const id_token = localStorage.getItem('id_token')
    const decoded = jwtDecoded(id_token)
    const {  auth_time, email } = decoded
    
    dispatch({ type: 'SET_DATA', path: 'account', value: email })
    apiGetList({ site }, dispatch)
    setModalOpen(false)
}