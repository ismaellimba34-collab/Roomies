import { initializeApp, getApp, getApps } from 'firebase/app';
// @ts-expect-error — getReactNativePersistence no está en los tipos publicados de firebase/auth,
// pero Metro sí resuelve el build de React Native que la incluye (paquete @firebase/auth, campo "react-native").
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Ismael — reemplazá estos placeholders con el firebaseConfig real
// (Firebase Console > Configuración del proyecto > Tus apps > SDK setup and configuration).
const firebaseConfig = {
  apiKey: 'TU_API_KEY_ACA',
  authDomain: 'roomiecba.firebaseapp.com',
  projectId: 'roomiecba',
  storageBucket: 'TU_STORAGE_BUCKET_ACA',
  messagingSenderId: 'TU_SENDER_ID_ACA',
  appId: 'TU_APP_ID_ACA',
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
