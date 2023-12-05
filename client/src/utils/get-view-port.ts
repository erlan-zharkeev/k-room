import { ViewPort } from 'src/@types'

export const getViewPort = (): ViewPort => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}
