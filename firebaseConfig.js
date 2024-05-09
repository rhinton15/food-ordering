import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARkUyXc2zZJ5SPs0LWOxZhjAkOHGveQIw",
  authDomain: "hello-world-c335c.firebaseapp.com",
  projectId: "hello-world-c335c",
  storageBucket: "hello-world-c335c.appspot.com",
  messagingSenderId: "729191067454",
  appId: "1:729191067454:web:5c1fcd72a779d1b9f3466f",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };
