import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUW991F28NzDdfzB4isy-2ahEz2DlY0aM",
  authDomain: "gwangju-lost-find.firebaseapp.com",
  projectId: "gwangju-lost-find",
  storageBucket: "gwangju-lost-find.firebasestorage.app",
  messagingSenderId: "239059483136",
  appId: "1:239059483136:web:72ba5b5ef8b85a77f976e5",
  measurementId: "G-0RHDNLG9HX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export { collection, addDoc, getDocs };
