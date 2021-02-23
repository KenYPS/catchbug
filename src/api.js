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
import useLocalStorage from 'useHooks/useLocalStorage'

export const service = axios.create()

service.interceptors.request.use(
  (config) => {
    config.headers.token = localStorage.getItem('accessToken')
    config.headers.idtoken = localStorage.getItem('idToken')
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use (
     (res) => {
    const result = fromJS(get(res, ['data', 'result']))
    const errorCode = get(res, ['data', 'error_code'])
    const errorMessage = get(res, ['data', 'error_msg'])

    if (errorCode !== 1) alert(errorMessage)
    return { result, errorCode, errorMessage }
  },
  (error) => {
    const errorMessage = get(error, ['response', 'data', 'error_msg'])
    console.error({ ...error })
    alert(errorMessage)
    return Promise.reject(error)
  }
)

// line
export const useLineLoggingCheck = (setModalOpen) => {
  const {
    state: { stateReducer },
    dispatch
  } = useContext(ContextStore)
  const site = stateReducer.getIn(['menuList', 0, 'name'])
  const [accessToken, setAccessToken] = useLocalStorage('accessToken')
  const [idToken, setIdToken] = useLocalStorage('idToken')
  const query = qs.parse(window.location.search.substring(1))
  const code = query.code

  useEffect(() => {
    if (accessToken && idToken) {
      apiLineAuth(setModalOpen, dispatch, site, idToken)
    }
  }, [accessToken, dispatch, idToken, setModalOpen, site])

  useEffect(() => {
    if (code && !accessToken) {
      apiLineLogin(
        setModalOpen,
        dispatch,
        site,
        code,
        setAccessToken,
        setIdToken
      )
    }
  }, [
    accessToken,
    code,
    dispatch,
    idToken,
    setAccessToken,
    setIdToken,
    setModalOpen,
    site
  ])
}

export const lineLogin = () => {
  // const search = qs.stringify({
  //   response_type: 'code',
  //   client_id: lineLoginConfig.client_id,
  //   redirect_uri: lineLoginConfig.redirect_uri,
  //   state: '123',
  //   scope: 'profile%20openid%20email'
  // })
  // console.log(search)
  let lineAuthUrl = 'https://access.line.me/oauth2/v2.1/authorize?'
  lineAuthUrl += 'response_type=code'
  lineAuthUrl += `&client_id=${lineLoginConfig.client_id}`
  lineAuthUrl += `&redirect_uri=${lineLoginConfig.redirect_uri}`
  lineAuthUrl += '&state=123'
  lineAuthUrl += '&scope=profile%20openid%20email'
  window.location.href = lineAuthUrl
}
// get list
export const apiGetList = (params, dispatch) =>
  service.get('/getList', { params }).then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
  })

// add list
export const apiAddList = (data, dispatch) =>
  service.put('/addItem', data).then(() => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value: '' })
  })

// remove list
export const apiDeleteList = (data, dispatch) =>
  service.put('/deleteItem', data).then(({ result }) => {
    dispatch({ type: 'SET_DATA', path: 'itemList', value: result })
  })

const apiLineAuth = (setModalOpen, dispatch, site, idToken) =>
  service.post('/line/auth').then(({ result }) => {
    loggedinAction({ setModalOpen, dispatch, site, idToken })
  })

const apiLineLogin = (
  setModalOpen,
  dispatch,
  site,
  code,
  setAccessToken,
  setIdToken
) => {
  const requestData = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: lineLoginConfig.redirect_uri,
    client_id: lineLoginConfig.client_id,
    client_secret: process.env.REACT_APP_client_secret
  }
  const data = qs.stringify(requestData)
  axios.post('https://api.line.me/oauth2/v2.1/token', data).then(
    (res) => {
      const { id_token: idToken, access_token: accessToken } = res.data
      setAccessToken(accessToken)
      setIdToken(idToken)

      loggedinAction({ setModalOpen, dispatch, site, idToken })
    },
    (err) => {
      console.log(err.response.data)
    }
  )
}

function loggedinAction ({ dispatch, setModalOpen, site, idToken }) {
  const decoded = jwtDecoded(idToken)
  const { email } = decoded

  dispatch({ type: 'SET_DATA', path: 'account', value: email })
  apiGetList({ site }, dispatch)
  setModalOpen(false)
}
