import { IInfoNotification } from 'common-types'

export const transformInfoMessage = (infoNotifications: IInfoNotification[]) => {
  return infoNotifications?.map((item) => {
    return { ...item, key: item.id }
  })
}
