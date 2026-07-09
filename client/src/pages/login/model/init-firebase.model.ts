import { getApps, initializeApp } from 'firebase/app'

export const initFirebase = () => {
  if (getApps().length) return

  initializeApp({
    apiKey: __CLIENT_ENV_DATA__.firebaseApiKey,
    authDomain: 'k-room-3a49a.firebaseapp.com',
    projectId: 'k-room-3a49a',
    storageBucket: 'k-room-3a49a.appspot.com',
    messagingSenderId: '199419640502',
    appId: '1:199419640502:web:71eb090633e8593d704417',
    measurementId: 'G-81GNPVFH7E'
  })
}
