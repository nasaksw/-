import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "본인_apiKey",
    authDomain: "본인_project.firebaseapp.com",
    projectId: "본인_projectId",
    storageBucket: "본인_project.appspot.com",
    messagingSenderId: "본인_senderId",
    appId: "본인_appId"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
};

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /lostPosts/{docId} {
      allow read, create: if true;
    }

    match /foundPosts/{docId} {
      allow read, create: if true;
    }
  }
}
