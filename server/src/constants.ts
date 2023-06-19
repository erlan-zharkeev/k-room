import { Constants } from './types/Constants'

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
  singleInviteMessage: 'Hi, this is an automatically created message, reply to start a conversation',
  multipleChatCreatedAuthorMessage: 'You have created group the chat',
  multipleInviteMessage: 'You have been added to group the chat'
}

export default constants
