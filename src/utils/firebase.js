import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjsV-ug59oNWXfmCwAaV_agXnWG7oZLB4",
  authDomain: "drezzup-93b31.firebaseapp.com",
  databaseURL: "https://drezzup-93b31-default-rtdb.firebaseio.com",
  projectId: "drezzup-93b31",
  storageBucket: "drezzup-93b31.appspot.com",
  messagingSenderId: "944730305258",
  appId: "1:944730305258:web:c23a373471156a3d2e1d93",
  measurementId: "G-5085DX3M7E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
