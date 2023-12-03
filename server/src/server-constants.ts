import { ServerConstants, SystemMessages } from './@types/Constants'

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
  maxMbQuantityTransfer: 10,
  messages: {
    system: [
      {
        id: '56cb91bdc3464f14678934ca',
        name: SystemMessages.inviteMessage,
        text: 'Hi, this is an automatically created message, reply to start a conversation'
      },
      {
        id: '56cb91bdc3464f14678934cb',
        name: SystemMessages.authorCreatedChat,
        text: 'You have created the chat'
      },
      {
        id: '56cb91bdc3464f14678934cc',
        name: SystemMessages.inviteGroupChat,
        text: 'You have been added to the group chat'
      },
      {
        id: '56cb91bdc3464f14678934cd',
        name: SystemMessages.authorCreatedGroupChat,
        text: 'You have created the group chat'
      }
    ]
  }
}
