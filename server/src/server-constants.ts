import { ServerConstants } from './@types/common'

export const serverConstants: ServerConstants = {
  sharp: {
    avatar: {
      dimensions: {
        x: 300,
        y: 300
      },
      quality: 100
    },
    'common-compressed': {
      quality: 60,
      dimensions: {
        x: null,
        y: null
      }
    },
    'common-uncompressed': {
      quality: 100,
      dimensions: {
        x: null,
        y: null
      }
    }
  },
  maxMbQuantityTransfer: 10
}
