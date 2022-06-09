import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config ={
        apiKey: "AIzaSyBhdk4L8HTvexIQU2tDyCsfD_HlM49OerM",
        authDomain: "react-chat-web-aee35.firebaseapp.com",
        databaseURL: "https://react-chat-web-aee35-default-rtdb.firebaseio.com",
        projectId: "react-chat-web-aee35",
        storageBucket: "react-chat-web-aee35.appspot.com",
        messagingSenderId: "139760472898",
        appId: "1:139760472898:web:903248b3941d0a127feedb"
}

const app=firebase.initializeApp(config);
export const auth=app.auth();
export const database=app.database();
export const storage=app.storage();