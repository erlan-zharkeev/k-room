export const buildPathWithParams = <T extends object>(basePath: string, params: T) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  })

  return `${basePath}?${searchParams.toString()}`
}
