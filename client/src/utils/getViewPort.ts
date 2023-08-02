import { ViewPort } from 'src/store/@types/SystemState'

export const getViewPort = (): ViewPort => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}
