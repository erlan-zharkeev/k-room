import { createUploader, wrapMulterSingle } from '../lib'

const avatarUploader = createUploader({
  maxMb: 2,
  supportedMediaType: ['image'],
  bucketName: 'avatar'
})

export const uploadAvatar = wrapMulterSingle((field) => avatarUploader.single(field))('avatar')

const docUploader = createUploader({
  maxMb: 10,
  supportedMediaType: ['pdf'],
  bucketName: 'doc'
})

export const uploadDoc = wrapMulterSingle((field) => docUploader.single(field))('file')
