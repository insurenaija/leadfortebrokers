
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCX9-A-9ECef_qPiOtXmGmrJ3E9ug6VYn8",
  authDomain: "leadfortebrokers.firebaseapp.com",
  projectId: "leadfortebrokers",
  storageBucket: "leadfortebrokers.firebasestorage.app",
  messagingSenderId: "787166433610",
  appId: "1:787166433610:web:6ce13784ed4141b873f1b3",
  measurementId: "G-JE2Q71ELV6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  serverTimestamp
};
