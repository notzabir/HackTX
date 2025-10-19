import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAdmoAo9HD1olgLQu7LGZNhqc6GF0gXjAw",
  authDomain: "hacktx-507d8.firebaseapp.com",
  projectId: "hacktx-507d8",
  storageBucket: "hacktx-507d8.firebasestorage.app",
  messagingSenderId: "934378427411",
  appId: "1:934378427411:web:c3b602ae4088c6d6419be6",
  measurementId: "G-QSSBS6J7CJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export default db;