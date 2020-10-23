import { useEffect, useContext } from 'react'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { fromJS } from 'immutable'
import get from 'lodash/get'
import '@firebase/auth'
import '@firebase/database'
import qs from 'querystring'
import jwtDecoded from 'jwt-decode'

import lineLoginConfig from 'common/lineLoginConfig'

export const service = axios.create()

service.interceptors.request.use(
  config => {
    config.headers.token = localStorage.getItem('access_token')
    config.headers.idtoken = localStorage.getItem('id_token')
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  res => {
    const result = fromJS(get(res, ['data', 'result']))
    const errorCode = get(res, ['data', 'error_code'])
    const errorMessage = get(res, ['data', 'error_msg'])

    if (errorCode !== 1) alert(errorMessage)
    return { result, errorCode, errorMessage }
  },
  error => {
    const errorMessage = get(error, ['response', 'data', 'error_msg'])
    console.error({ ...error })
    alert(errorMessage)
    return Promise.reject(error)
  }
)

// line
export const useLineLoggingCheck = (setModalOpen, token) => {
  const { state: { stateReducer }, dispatch } = useContext(ContextStore)
  const site = stateReducer.getIn(['menuList', 0, 'name'])
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const code = query.get('code') || token
  const accessToken = localStorage.getItem('access_token')

  useEffect(() => {
    if (accessToken && !code) {
      service.defaults.headers.accessToken = accessToken
      apiLineAuth(setModalOpen, dispatch, site)
    } else if (code && !accessToken) {
      apiLineLogin(setModalOpen, dispatch, site, code)
    }
  }, [accessToken, code, dispatch, setModalOpen, site])
}

export const lineLogin = () => {
  const search = qs.stringify({
    response_type: 'code',
    client_id: lineLoginConfig.client_id,
    redirect_uri: lineLoginConfig.redirect_uri,
    state: '123',
    scope: 'profile+openid+email'
  })
  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?${search}`
  window.location.href = lineAuthUrl
}
// get list
export const apiGetList = (params, dispatch) => service
  .get('/getList', { params })
  .then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
  })

// add list
export const apiAddList = (data, dispatch) => service
  .put('/addItem', data)
  .then(() => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value: '' })
  })

// remove list
export const apiDeleteList = (data, dispatch) => service
  .put('/deleteItem', data)
  .then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
  })

const apiLineAuth = (setModalOpen, dispatch, site) => service
  .post('/line/auth')
  .then(({ result }) => {
    loggedinAction({ setModalOpen, dispatch, site })
  })

const apiLineLogin = (setModalOpen, dispatch, site, code) => {
  const requestData = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: lineLoginConfig.redirect_uri,
    client_id: lineLoginConfig.client_id,
    client_secret: process.env.REACT_APP_apiKey
  }

  const data = qs.stringify(requestData)
  axios.post('https://api.line.me/oauth2/v2.1/token', data)
    .then(res => {
      const { id_token: idToken, access_token: accessToken } = res.data
      localStorage.removeItem('access_token')
      localStorage.removeItem('id_token')
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('id_token', idToken)
      loggedinAction({ setModalOpen, dispatch, site })
    }, err => {
      console.log(err.response.data)
    })
}

function loggedinAction ({ dispatch, setModalOpen, site }) {
  const idToken = localStorage.getItem('id_token')
  const decoded = jwtDecoded(idToken)
  const { email } = decoded

  dispatch({ type: 'SET_DATA', path: 'account', value: email })
  apiGetList({ site }, dispatch)
  setModalOpen(false)
}
