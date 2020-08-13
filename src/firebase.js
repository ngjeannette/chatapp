// import firebase from 'firebase'
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyBEE2-LZbh-BA_ZevH0FoANZ11-A7o9E1M",
    authDomain: "chatapp-befa6.firebaseapp.com",
    databaseURL: "https://chatapp-befa6.firebaseio.com",
    projectId: "chatapp-befa6",
    storageBucket: "chatapp-befa6.appspot.com",
    messagingSenderId: "337625400601",
    appId: "1:337625400601:web:cd8d7583825c47f2557188",
    measurementId: "G-8TEHGK6E0V"
};
firebase.initializeApp(firebaseConfig);
export default firebase;