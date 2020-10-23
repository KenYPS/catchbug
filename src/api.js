import { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { fromJS } from 'immutable'
import get from 'lodash/get'
import '@firebase/auth'
import '@firebase/database'
import qs from 'querystring'
import jwtDecoded from 'jwt-decode'

import useLocalStorage from 'useHooks/useLocalStorage'

import line_login from './common/lineLogin'


export const service = axios.create()

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token')
        const idtoken = localStorage.getItem('id_token')
        config.headers.token = JSON.parse(token)
        config.headers.idtoken = JSON.parse(idtoken)
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
        // const result = fromJS(get(error, ['response','data', 'result']))
        // const error_code = get(error, ['response',"data", "error_code"])
        const error_msg = get(error, ['response', "data", "error_msg"])
        console.error({ ...error })
        alert(error_msg)
        return Promise.reject(error)
    }
)



// line 
export const useLineLoggingCheck = (setModalOpen,) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const [storageAccessToken, setStorageAccessToken] = useLocalStorage('access_token')
    const [storageIdToken, setStorageIdToken] = useLocalStorage('id_token')
    const [code] = useState(new URLSearchParams(window.location.search).get('code'))
    const site = stateReducer.getIn(['menuList', 0, 'name'])

    useEffect(() => {
        if (storageAccessToken) {
            apiLineAuth(setModalOpen, dispatch, site, storageIdToken)
        } else if (code && !storageAccessToken) {
            apiLineLogin({ setModalOpen, dispatch, site, code, setStorageAccessToken, setStorageIdToken })
        }
    }, [code, dispatch, setModalOpen, setStorageAccessToken, setStorageIdToken, site, storageAccessToken, storageIdToken])

}

export const lineLogin = () => {
    const query = qs.stringify({
        response_type: 'code',
        client_id: line_login.client_id,
        redirect_uri: line_login.redirect_uri,
        state: 123,
        scope: 'profile%20openid%20email'
    })
    const URL = `https://access.line.me/oauth2/v2.1/authorize?${query}`
    window.location.href = URL
}
// get list
export const apiGetList = (params, dispatch) => service.get('/getList', { params }).then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
})

// add list
export const apiAddList = (data, dispatch) => service.put('/addItem', data).then(({ error_code, result }) => {
}, err => { }).then(() => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value: '' })
})

// remove list
export const apiDeleteList = (data, dispatch) => service.put('/deleteItem', data).then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
})


const apiLineAuth = (setModalOpen, dispatch, site, storageIdToken) => service.post('/line/auth').then(({ result }) => {
    loggedinAction({ setModalOpen, dispatch, site, storageIdToken })
})


const apiLineLogin = ({ setModalOpen, dispatch, site, code, setStorageAccessToken, setStorageIdToken }) => {
    let requestData = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: line_login.redirect_uri,
        client_id: line_login.client_id,
        client_secret: process.env.REACT_APP_client_secret
    }

    const data = qs.stringify(requestData)
    axios.post('https://api.line.me/oauth2/v2.1/token', data).then(res => {
        const { id_token, access_token } = res.data
        console.log(id_token)
        setStorageAccessToken(access_token)
        setStorageIdToken(id_token)
        apiLineAuth(setModalOpen, dispatch, site)
    }, err => {
        console.log(err.response.data)
    })
}


function loggedinAction({ dispatch, setModalOpen, site, storageIdToken }) {
    const decoded = jwtDecoded(storageIdToken)
    const { email } = decoded
    dispatch({ type: 'SET_DATA', path: 'account', value: email })
    apiGetList({ site }, dispatch)
    setModalOpen(false)
}







