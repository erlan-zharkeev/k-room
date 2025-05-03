import { IInfoMessage } from 'common-types'

export const transformInfoMessage = (infoNotifications: IInfoMessage[]) => {
  return infoNotifications?.map((item) => {
    return { ...item, key: item.id }
  })
}
