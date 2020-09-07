// Required for side-effects
import * as firebase from 'firebase'
import axios from 'axios'
import "firebase/firestore"

firebase.initializeApp({
    apiKey: 'AIzaSyBxAFJNcRi0dF2BVMnLBjF-HqZQdNfuAS0',
    authDomain: 'catchbug-f8326.firebaseapp.com',
    projectId: 'catchbug-f8326'
});

var db = firebase.firestore();

// login
export const apiLogin = (account, password) => {
    return db.auth().signInWithEmailAndPassword(account, password)
}

export const getMenuList = () => axios.get('/menuList').then(res=>{
    console.log(res);
})