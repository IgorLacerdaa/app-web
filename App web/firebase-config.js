const firebaseConfig = {
  apiKey: "AIzaSyDVoGVkhLEkodWlPsZm5SHjn8LJlNYM2cc",
  authDomain: "app-alerta-ruas-perigosas.firebaseapp.com",
  projectId: "app-alerta-ruas-perigosas",
  storageBucket: "app-alerta-ruas-perigosas.appspot.com",
  messagingSenderId: "676088322966",
  appId: "1:676088322966:web:3f497e295a2d9d3ea81bb7",
  measurementId: "G-M9RTBF4Z7H"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();