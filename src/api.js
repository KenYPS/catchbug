import React, {useEffect} from 'react'

import * as firebase from 'firebase'
import axios from 'axios'
import "firebase/firestore"

import useDefaultFetchFunc from "useHooks/useFetchData"

firebase.initializeApp({
    apiKey: 'AIzaSyBxAFJNcRi0dF2BVMnLBjF-HqZQdNfuAS0',
    authDomain: 'catchbug-f8326.firebaseapp.com',
    projectId: 'catchbug-f8326'
});


export const useVerifyUser = ()=>{
    useEffect(()=>{
        console.log(apiVerifyUser());
    },[])
}

export const apiVerifyUser = () => {
    return firebase.auth().currentUser
}

export const apiLogin = (account, password, dispatch, setModalOpen) => {
   return firebase.auth().signInWithEmailAndPassword(account, password).then(res=>{
       dispatch({ type: 'SET_DATA', path: 'account', value: res.user.email })
       setModalOpen(false)
}).catch(res=>{
    alert(res)
    return res
})
}

export const useApiGetData = ({ account, selectedMonth }) => {
    return useDefaultFetchFunc({
        api: firebase.database().ref(`/cutoff/${account}/${selectedMonth}`)
    })

}

export const apiAddData = ({ account, sendData, cutoffMonth }) => {
    return firebase.database().ref(`/cutoff/${account}/${cutoffMonth}`).push(sendData)
}