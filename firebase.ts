import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAwToPbNyLNAeYfpZfHw8v2UzjA97X6VCE",
  authDomain: "a2zfashion-efd4e.firebaseapp.com",
  databaseURL:
    "https://a2zfashion-efd4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "a2zfashion-efd4e",
  storageBucket: "a2zfashion-efd4e.firebasestorage.app",
  messagingSenderId: "225432212073",
  appId: "1:225432212073:web:e31a041c4df7aaaa2b48f8",
};

export const app = initializeApp(firebaseConfig);

export const testConnection = () => {
  console.log("Firebase connected:", app.name);
};
