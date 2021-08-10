import firebase from 'firebase'


const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDBvk8KTnuTgzw3x3BOyWTTz9OyKqZZE3Y",
  authDomain: "instagram-clone-b02b0.firebaseapp.com",
  projectId: "instagram-clone-b02b0",
  storageBucket: "instagram-clone-b02b0.appspot.com",
  messagingSenderId: "802648336448",
  appId: "1:802648336448:web:e4319dac920f270041d7a5",
  measurementId: "G-5BGTLBW4V2"

});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage}

    
   








// const firebaseConfig = {
//   apiKey: "AIzaSyDBvk8KTnuTgzw3x3BOyWTTz9OyKqZZE3Y",
//     authDomain: "instagram-clone-b02b0.firebaseapp.com",
//     projectId: "instagram-clone-b02b0",
//     storageBucket: "instagram-clone-b02b0.appspot.com",
//     messagingSenderId: "802648336448",
//     appId: "1:802648336448:web:e4319dac920f270041d7a5",
//     measurementId: "G-5BGTLBW4V2"
//   };
// firebase.initializeApp(firebaseConfig)
