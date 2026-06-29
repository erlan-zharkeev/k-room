const startApp = async () => {
  const canStart = await window.__K_ROOM_CLIENT_RECOVERY_READY__?.catch(() => true)

  if (canStart === false) return

  await import('src/app/bootstrap/mount-app')
}

void startApp()
