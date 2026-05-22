import 'vite/client'

declare global {
  interface Window {
    $notifications: UseNotification
  }
}

export {}
