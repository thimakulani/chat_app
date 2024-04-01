import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAEpwGZyfVl_fBCfp7aA3fZMguKA4VmF0A",
    authDomain: "chat-app-7ab10.firebaseapp.com",
    projectId: "chat-app-7ab10",
    storageBucket: "chat-app-7ab10.appspot.com",
    messagingSenderId: "1054735420666",
    appId: "1:1054735420666:web:5d5fb8e8b32e62ef358d43",
    measurementId: "G-E71XYEDENX"
};

firebase.initializeApp(firebaseConfig);
const fb_config = firebase;
export { fb_config };
export const API_URL = 'https://chat-app-api-6a39.onrender.com';

