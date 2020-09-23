import { useEffect, useContext } from 'react'
import * as firebase from 'firebase'
import axios from 'axios'
import { ContextStore } from 'Reducer'
import { fromJS } from 'immutable'

import { abstractAccount } from 'Utils'

// firebase config
import config from './config'

// ifirebase
firebase.initializeApp(config)

const database = firebase.database()

function logginedDispatch(user, setModalOpen, dispatch, site, res) {
    const account = abstractAccount(user.email)
    user.getIdToken().then(function (token) {
        localStorage.setItem('token', token) 
        apiGetList({ site })
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
            console.log(user);
            if (user) {
                logginedDispatch(user, setModalOpen, dispatch, site)
            } else {
                setModalOpen(true)
            }
        })
    }, [dispatch, setModalOpen, site])

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
export const apiLogOut = () => {
    localStorage.removeItem('token')
    return firebase.auth().signOut()
}


export const service = axios.create()

service.interceptors.request.use(
    config => {
        console.log(config);
        const token = localStorage.getItem('token')
        config.headers.Token = token
        return config
    },
    error => {
        return Promise.reject(error)
    }
)   



// get list
export const apiGetList = (params) => service.get('/getList', { params }).then(res => {
    console.log(res)
})


// add list
export const useApiAddList = (data) => {
    const { state: { stateReducer } } = useContext(ContextStore)
    

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

