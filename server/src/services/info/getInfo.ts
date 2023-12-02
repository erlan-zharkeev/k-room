import { InfoItem, InfoItemStatus } from '../../@types'
import { welcome } from './items'

const infoMap: Record<string, InfoItem> = {
  '1': {
    id: '1',
    label: 'Welcome to K-Room',
    read: InfoItemStatus.unread,
    content: '',
    contentComponent: welcome
  }
}

export const getInfo = (id: string) => {
  const item = infoMap[id]
  if (!item.contentComponent) return null
  const currentContent = item.contentComponent()
  return {
    id: item.id,
    label: item.label,
    read: item.read,
    content: currentContent
  }
}
