
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuração do Firebase (substitua com seus próprios dados)
const firebaseConfig = {
  apiKey: "AIzaSyDY3UGeBsOosd5DXYieOrHNmi9xr2e28Rc",
  authDomain: "memoriasafetivas-1232.firebaseapp.com",
  projectId: "memoriasafetivas-1232",
  storageBucket: "memoriasafetivas-1232.firebasestorage.app",
  messagingSenderId: "949485239403",
  appId: "1:949485239403:web:abda2ec7a457571df9c52e",
  measurementId: "G-XP1L2S8HMF"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Instâncias do Firestore e Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, ref, uploadBytes };
