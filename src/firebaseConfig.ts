import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAYIMsENOlMUaAK2AFlgy4S-F8XVdT4NDk",
  authDomain: "baby-cry-monitor.firebaseapp.com",
  databaseURL: "https://baby-cry-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "baby-cry-monitor",
  storageBucket: "baby-cry-monitor.firebasestorage.app",
  messagingSenderId: "502608480033",
  appId: "1:502608480033:web:842caad7c871dd317ee060",
  measurementId: "G-CSH4T96LQB"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };

