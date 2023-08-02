import { AxiosResponse } from 'axios'

export type ColorModifiers = 'accent' | 'success' | 'error' | 'warn' | 'default' | 'white' | 'black'

export type SizeModifiers = 'xl' | 'large' | 'medium' | 'small'

export type ShapeModifiers = 'round' | 'square'

export interface AsyncThunkResponseWrapper {
  payload: AxiosResponse
}
