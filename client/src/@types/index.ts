import { AxiosResponse } from 'axios'

export type ColorModifiers = 'accent' | 'success' | 'error' | 'warn' | 'default' | 'white' | 'black'

export type SizeModifiers = 'large' | 'medium' | 'small'

export interface AsyncThunkResponseWrapper {
  payload: AxiosResponse
}
