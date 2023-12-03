export enum SharpSettingsKey {
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

export enum SystemMessages {
  inviteMessage = 'invite-message',
  authorCreatedChat = 'author-created-chat',
  authorCreatedGroupChat = 'author-created-group-chat',
  inviteGroupChat = 'invite-group-chat'
}

export interface SystemMessage {
  id: string
  name: SystemMessages
  text: string
}

export interface ServerConstants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
  messages: {
    system: Array<SystemMessage>
  }
}
