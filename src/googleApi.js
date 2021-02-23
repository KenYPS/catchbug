import { useEffect, useContext } from 'react'
import firebase from '@firebase/app'
import { ContextStore } from 'Reducer'
import '@firebase/auth'
import '@firebase/database'

import { abstractAccount } from 'Utils'

// firebase config
import config from './config'

// ifirebase
firebase.initializeApp(config)

function logginedDispatch (user, setModalOpen, dispatch, site) {
  const account = abstractAccount(user.email)
  user.getIdToken().then(function (token) {
    localStorage.setItem('token', token)
    // apiGetList({ site }, dispatch)
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
  return () => firebase.auth().signInWithRedirect(provider).then(res => {
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
