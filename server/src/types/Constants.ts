export enum SharpSettingsKey {
  avatar = 'avatar',
  'common-compressed' = 'common-compressed',
  'common-uncompressed' = 'common-uncompressed'
}

interface SharpConfig {
  quality: number
  dimensions: {
    x: number | null
    y: number | null
  }
}

export enum SystemMessages {
  'invite-message' = 'invite-message',
  'author-created-chat' = 'author-created-chat',
  'author-created-group-chat' = 'author-created-group-chat',
  'invite-group-chat' = 'invite-group-chat'
}

export interface SystemMessage {
  id: string
  name: SystemMessages
  text: string
}

export interface Constants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
  messages: {
    system: Array<SystemMessage>
  }
}
