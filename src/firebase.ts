import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA25tfjfPruW43X6tcPXfeXYhNAD_hF_7M",
  authDomain: "chatered-accountant-da439.firebaseapp.com",
  projectId: "chatered-accountant-da439",
  storageBucket: "chatered-accountant-da439.firebasestorage.app",
  messagingSenderId: "893534567419",
  appId: "1:893534567419:web:bb1491fd951c3b1b1a295e",
  measurementId: "G-YKEF81Z18X",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
