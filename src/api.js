import { useEffect, useContext } from 'react'
import * as firebase from 'firebase'
import axios from 'axios'
import { ContextStore } from 'Reducer'


import { abstractAccount } from 'Utils'

 firebase.initializeApp({
    apiKey: "AIzaSyBxAFJNcRi0dF2BVMnLBjF-HqZQdNfuAS0",
    authDomain: "catchbug-f8326.firebaseapp.com",
    databaseURL: "https://catchbug-f8326.firebaseio.com",
    projectId: "catchbug-f8326",
    storageBucket: "catchbug-f8326.appspot.com",
    messagingSenderId: "79127123951",
    appId: "1:79127123951:web:946cbdf80d0bfa276ec81a",
    measurementId: "G-TGXGE92TFY"
})
const database = firebase.database()

export const useVerifyUser = () => {
    useEffect(() => {
        console.log(apiVerifyUser())
    }, [])
}

export const apiVerifyUser = () => {
    return firebase.auth().currentUser
}

export const useApiLogin = (setModalOpen) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    return (account, password) => firebase.auth().signInWithEmailAndPassword(account, password).then(res => {
        console.log(333);
        const account = abstractAccount(res.user.email)
        apiGetData({ account, site, dispatch })
        dispatch({ type: 'SET_DATA', path: 'account', value: account })
        setModalOpen(false)

    }).catch(res => {
        alert(res)
        return res
    })
}



export const apiLogin = (data)=>{
    return axios.post('/login', data)
}

export const apiGetData = ({ account, site ,dispatch}) => {
    const data = database.ref(`/${site}/${account}`).once("value", (res) => {
        const val = res.val()
        let array = []
        for (const key in val) {
            if (val.hasOwnProperty(key)) {
                const element = Map(val[key]).merge(Map({ key }))
                array.push(element)
            }
        }
        dispatch({ type: 'SET_DATA', path: 'itemList', value: array })

    })
}

export const apiAddData = ({ account, site, sendData, }) => {
   database.ref(`/${site}/${account}`).push(sendData)
}