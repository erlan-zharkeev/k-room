import { ViewPort } from 'src/store/@types/SystemState'

const getViewPort = (): ViewPort => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

export default getViewPort
