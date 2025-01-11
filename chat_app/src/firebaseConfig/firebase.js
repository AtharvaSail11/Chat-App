import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCTo_CyTXe-2sTlz3RVypdRTInBW07tVfA",
    authDomain: "chat-app-4c1bf.firebaseapp.com",
    projectId: "chat-app-4c1bf",
    storageBucket: "chat-app-4c1bf.firebasestorage.app",
    messagingSenderId: "124928019766",
    appId: "1:124928019766:web:b5911232563b41fa3fb797",
    measurementId: "G-5CZH8HFESY"
  };

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);
const auth=getAuth(app);

export {app,auth,db};
  