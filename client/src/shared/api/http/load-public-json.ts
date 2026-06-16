import { httpClient } from './http-client'

export const loadPublicJson = async <T = unknown>(url: string) => {
  const response = await httpClient.get<T>(url)

  return response.data
}
