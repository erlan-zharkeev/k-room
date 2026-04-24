export const errorToMessage = (error: unknown, fallbackMessage = 'Unknown error') => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  try {
    return JSON.stringify(error)
  } catch {
    return fallbackMessage
  }
}
