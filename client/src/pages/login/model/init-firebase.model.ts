export const initFirebase = async () => {
  const { getApps, initializeApp } = await import('firebase/app')

  if (getApps().length) return

  initializeApp({
    apiKey: __CLIENT_ENV_DATA__.firebaseApiKey,
    authDomain: __CLIENT_ENV_DATA__.firebaseAuthDomain,
    projectId: 'k-room-3a49a',
    storageBucket: 'k-room-3a49a.appspot.com',
    messagingSenderId: '199419640502',
    appId: '1:199419640502:web:71eb090633e8593d704417',
    measurementId: 'G-81GNPVFH7E'
  })
}
