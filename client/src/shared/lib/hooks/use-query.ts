import { useLocation } from 'react-router-dom'

export const useQuery = () => {
  const { search } = useLocation()

  const buildPathWithParams = (basePath: string, params: Record<string, string | number | boolean | undefined>) => {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        sp.set(key, String(value))
      }
    }
    return `${basePath}?${sp.toString()}`
  }

  return { value: new URLSearchParams(search), buildPathWithParams }
}
