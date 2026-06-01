import { CodeModel } from '../codes.model'

export const findPasswordRecoveryCodeByQuery = (query: string) => {
  return CodeModel.findOne({ 'codes.passwordRecovery.query.value': query })
}

export const clearPasswordRecoveryCode = (userId: string) => {
  return CodeModel.updateOne(
    {
      _id: userId
    },
    {
      $set: {
        'codes.passwordRecovery.query.value': '',
        'codes.passwordRecovery.query.expiresAt': 0,
        'codes.passwordRecovery.email.value': '',
        'codes.passwordRecovery.email.expiresAt': 0,
        nextRequestPossibleAt: null
      }
    }
  )
}
