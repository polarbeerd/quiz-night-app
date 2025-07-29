import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfigProd = {
  // paste your config here
  apiKey: "AIzaSyAoJfKVsjnKZjt8YZ811_mZzSqPGl6gm7Y",
  authDomain: "quizmoderatorapp.firebaseapp.com",
  projectId: "quizmoderatorapp",
  storageBucket: "quizmoderatorapp.firebasestorage.app",
  messagingSenderId: "756737896938",
  appId: "1:756737896938:web:5ead994a2c59b3f4118293",
};

const firebaseConfigDemo = {
  apiKey: "AIzaSyDDD25i3TtVaiXHEhwE2H05p4OyaxlZ0tw",
  authDomain: "quizmoderatorapp-demo.firebaseapp.com",
  projectId: "quizmoderatorapp-demo",
  storageBucket: "quizmoderatorapp-demo.firebasestorage.app",
  messagingSenderId: "788456899732",
  appId: "1:788456899732:web:b9fd1ca6772b24f588e081",
};

const isDemo = localStorage.getItem("demo") === "true";

const app = initializeApp(isDemo ? firebaseConfigDemo : firebaseConfigProd);
export const db = getFirestore(app);
