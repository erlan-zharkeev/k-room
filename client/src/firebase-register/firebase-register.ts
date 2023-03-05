import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import ENV from 'src/ENV'

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
  measurementId: ENV.FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
