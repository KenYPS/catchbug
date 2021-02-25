import { useEffect } from 'react'
import axios from 'axios'
import get from 'lodash/get'
import '@firebase/auth'
import '@firebase/database'
import qs from 'querystring'
import jwtDecoded from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'

import lineLoginConfig from 'common/lineLoginConfig'

import { setUserDetail } from 'Reducer/userSlice'
import { selectData } from 'Reducer/dataSlice'
import { fetchItemList } from 'Reducer/dataSlice'
import { setToken } from 'Reducer/userSlice'
import { selectUser } from 'Reducer/userSlice'
export const service = axios.create()

service.interceptors.request.use(
  (config) => {
    config.headers.token = localStorage.getItem('accessToken')
    config.headers.idtoken = localStorage.getItem('idToken')
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (res) => {
    const result = get(res, ['data', 'result'])
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
export const useLineLoggingCheck = () => {
  const { accessToken, idToken } = useSelector(selectUser)
  const dispatch = useDispatch()
  const { menuList } = useSelector(selectData)
  const site = menuList[0].name
  const query = qs.parse(window.location.search.substring(1))
  const code = query.code

  useEffect(() => {
    if (code && !accessToken) {
      apiLineLogin(dispatch, code)
    }
  }, [accessToken, code, dispatch, idToken, site])

  useEffect(() => {
    if (accessToken && idToken) {
      apiLineAuth(dispatch, site, idToken)
    }
  }, [accessToken, dispatch, idToken, site])

}

export const lineLogin = () => {
  let lineAuthUrl = 'https://access.line.me/oauth2/v2.1/authorize?'
  lineAuthUrl += 'response_type=code'
  lineAuthUrl += `&client_id=${lineLoginConfig.client_id}`
  lineAuthUrl += `&redirect_uri=${lineLoginConfig.redirect_uri}`
  lineAuthUrl += '&state=success'
  lineAuthUrl += '&scope=profile%20openid%20email'
  window.location.href = lineAuthUrl
}

export const apiLineLogout = (dispatch) => {
  service.post('/logout').then((res) => {
    dispatch()
  })
}

const apiLineAuth = (dispatch, site, idToken) =>
  service.post('/line/auth').then(({ result }) => {
    loggedinAction({ dispatch, site, idToken })
  })

const apiLineLogin = (dispatch, code) => {
  const requestData = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: lineLoginConfig.redirect_uri,
    client_id: lineLoginConfig.client_id,
    client_secret: process.env.REACT_APP_client_secret,
  }
  const data = qs.stringify(requestData)
  axios.post('https://api.line.me/oauth2/v2.1/token', data).then(
    (res) => {
      const { id_token: idToken, access_token: accessToken } = res.data
      dispatch(setToken({ accessToken, idToken }))
      // loggedinAction({ dispatch, site, idToken })
    },
    (err) => {
      console.log(err.response.data)
    }
  )
}

function loggedinAction({ dispatch, site, idToken }) {
  const decoded = jwtDecoded(idToken)
  const { email } = decoded
  dispatch(setUserDetail(email))
  dispatch(fetchItemList({ site }))
  // apiGetList({ site }, dispatch)
}
