import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

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
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

const db = getFirestore(app);

export { app, db };
// export { app, auth, db };
