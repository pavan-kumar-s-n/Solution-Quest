// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjTkYyRECUcMA2WWcs8cyeX3KxDAALK4s",
  authDomain: "forum-app-e251c.firebaseapp.com",
  projectId: "forum-app-e251c",
  storageBucket: "forum-app-e251c.appspot.com",
  messagingSenderId: "142645871396",
  appId: "1:142645871396:web:732efde330d3c07fffe9b1",
  measurementId: "G-E6Y60EXP83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
