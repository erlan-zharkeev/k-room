import { Constants, SystemMessages } from './types/Constants'

export const constants: Constants = {
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
        name: SystemMessages['invite-message'],
        text: 'Hi, this is an automatically created message, reply to start a conversation'
      },
      {
        id: '56cb91bdc3464f14678934cb',
        name: SystemMessages['author-created-chat'],
        text: 'You have created the chat'
      },
      {
        id: '56cb91bdc3464f14678934cc',
        name: SystemMessages['invite-group-chat'],
        text: 'You have been added to group the chat'
      },
      {
        id: '56cb91bdc3464f14678934cd',
        name: SystemMessages['author-created-group-chat'],
        text: 'You have created group the chat'
      }
    ]
  }
}

export default constants
