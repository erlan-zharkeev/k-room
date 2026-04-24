import 'vite/client'

declare global {
  interface Window {
    $notifications: UseNotificationType
  }
}

export {}
