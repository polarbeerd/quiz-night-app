import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // paste your config here
  apiKey: "AIzaSyAoJfKVsjnKZjt8YZ811_mZzSqPGl6gm7Y",
  authDomain: "quizmoderatorapp.firebaseapp.com",
  projectId: "quizmoderatorapp",
  storageBucket: "quizmoderatorapp.firebasestorage.app",
  messagingSenderId: "756737896938",
  appId: "1:756737896938:web:5ead994a2c59b3f4118293",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
