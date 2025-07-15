import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAk5EFTxqg5Dvi8k5N9PNfb4jPVzhJ6Wg",
  authDomain: "am-fit-51ef6.firebaseapp.com",
  projectId: "am-fit-51ef6",
  storageBucket: "am-fit-51ef6.appspot.com",
  messagingSenderId: "45915878927",
  appId: "1:45915878927:web:42c9a697d70c611ae2557a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
