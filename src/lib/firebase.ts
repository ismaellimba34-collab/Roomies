import { initializeApp, getApp, getApps } from 'firebase/app';
// @ts-expect-error — getReactNativePersistence no está en los tipos publicados de firebase/auth,
// pero Metro sí resuelve el build de React Native que la incluye (paquete @firebase/auth, campo "react-native").
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDY24TXz13Wj1n7aVdh2HmM88mZo8r7FJ4',
  authDomain: 'roomiecba.firebaseapp.com',
  projectId: 'roomiecba',
  storageBucket: 'roomiecba.firebasestorage.app',
  messagingSenderId: '882781236866',
  appId: '1:882781236866:web:14307fa270e64b0af88e9b',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: ReturnType<typeof getAuth>;
try {
  // Necesario para que la sesión persista entre cierres de la app en Expo Go.
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  // En Fast Refresh, initializeAuth ya fue llamado antes: reusamos la instancia.
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
