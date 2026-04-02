export const errorToMessage = (err: unknown, fallbackErrorText?: string): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return fallbackErrorText ?? 'Unknown error'
  }
}
