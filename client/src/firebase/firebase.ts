import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
const { VITE_FIREBASE_API_KEY } = import.meta.env

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: 'k-room-3a49a.firebaseapp.com',
  projectId: 'k-room-3a49a',
  storageBucket: 'k-room-3a49a.appspot.com',
  messagingSenderId: '199419640502',
  appId: '1:199419640502:web:71eb090633e8593d704417',
  measurementId: 'G-81GNPVFH7E'
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
