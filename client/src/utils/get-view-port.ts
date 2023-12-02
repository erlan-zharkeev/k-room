import { ViewPort } from 'src/store/@types/system-state'

export const getViewPort = (): ViewPort => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}
