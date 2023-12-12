import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCmeu1zCvd1Q12hKOBG1SnHNHjKt6MH_yg",
  authDomain: "countdown-8d327.firebaseapp.com",
  databaseURL: "https://countdown-8d327-default-rtdb.firebaseio.com",
  projectId: "countdown-8d327",
  storageBucket: "countdown-8d327.appspot.com",
  messagingSenderId: "103677949207",
  appId: "1:103677949207:web:1ab7fe5629014845d83352",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
