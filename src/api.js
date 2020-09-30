import { useEffect, useContext } from 'react'
import * as firebase from 'firebase'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { Map, fromJS } from 'immutable'

import { abstractAccount } from 'Utils'

// firebase config
import config from './config'

// ifirebase
firebase.initializeApp(config)

const database = firebase.database()

function logginedDispatch(user, setModalOpen, dispatch ,site) {
    const account = abstractAccount(user.email)
    setModalOpen(false)
    dispatch({ type: 'SET_DATA', path: 'account', value: account })
    apiGetList({account, site})
}

// verify isLogged in

export const useApiVerifyUser = (setModalOpen) => {
    const { state: { stateReducer },dispatch } = useContext(ContextStore)
    const site = stateReducer.getIn(['menuList', 0, 'name'])

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user=>{
            if (user) {
                logginedDispatch(user, setModalOpen, dispatch, site )
            } else{
                setModalOpen(true)
            }
        })
    },[dispatch, setModalOpen, site])

}

// email login
export const useApiEmailLogin = (setModalOpen) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    return (account, password) => firebase.auth().signInWithEmailAndPassword(account, password).then(res => {
        const user = res.user
        apiGetData({ account, site, dispatch })
        logginedDispatch(user, setModalOpen, dispatch)

    }).catch(res => {
        alert(res)
        return res
    })
}


//  google account login
export const useApiGoogleLogin = (setModalOpen) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const provider = new firebase.auth.GoogleAuthProvider()
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    return () => new firebase.auth().signInWithRedirect(provider).then(res => {
        const user = res.user
        logginedDispatch(user, setModalOpen, dispatch, site)
    })
}
// log out
export const apiLogOut = ()=>{
   return firebase.auth().signOut()
}

// get list
export const apiGetList = (params) => axios.get('/getList', {params} ).then(res=>{
        console.log(res);
    })

// add list
export const useApiAddList = (data)=>{
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    const account = stateReducer.get('account')
    return database().ref(`/${site}/${account}`).push(data)

}

// remove list





// get data from back
export const apiGetData = ({ account, site, dispatch }) => {




    database.ref(`/${site}/${account}`).once("value", (res) => {
        const val = res.val()
        dispatch({ type: 'SET_DATA', path: 'itemList', value: fromJS(val) })
    })
}

export const apiAddData = ({ account, site, sendData, }) => {
    database.ref(`/${site}/${account}`).push(sendData)
}

