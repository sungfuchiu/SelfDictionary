import firebase from 'firebase'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyBowHnZc-RNlNzvYMbXYsh2TsZ7hs31sEA",
    authDomain: "my-dictionary-2852a.firebaseapp.com",
    databaseURL: "https://my-dictionary-2852a.firebaseio.com",
    projectId: "my-dictionary-2852a",
    storageBucket: "my-dictionary-2852a.appspot.com",
    messagingSenderId: "801722026984",
    appId: "1:801722026984:web:88997098f2bdab5328b25d",
    measurementId: "G-1N9W50FMQT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); 
const db = firebase.database();
const database = firebase.database;

export{
    db,
    database
}