export enum SharpKey {
  avatar = 'avatar',
  commonCompressed = 'common-compressed',
  commonUncompressed = 'common-uncompressed'
}

interface SharpConfig {
  quality: number
  dimensions: {
    x: number | null
    y: number | null
  }
}

type Sharp = {
  [key in SharpKey]: SharpConfig
}

export interface Constants {
  sharp: Sharp
  singleInviteMessage: string
  multipleChatCreatedAuthorMessage: string
  multipleInviteMessage: string
  maxMbQuantityTransfer: number
}
