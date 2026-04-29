import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByJOKgvEbe79xF9HYwiByLV7qiS06nYO0",
  authDomain: "danceconnect-4ff14.firebaseapp.com",
  projectId: "danceconnect-4ff14",
  storageBucket: "danceconnect-4ff14.firebasestorage.app",
  messagingSenderId: "108760177860",
  appId: "1:108760177860:web:0eab37badbb6ed7f5bbd91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);