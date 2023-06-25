import { InfoItem } from '../../../../types'
import welcome from './items/welcome'

const infoMap = {
  '1': {
    id: '1',
    label: 'Welcome to K-Room',
    read: 'unread',
    content: '',
    contentComponent: welcome
  }
} as {
  [key: string]: InfoItem
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
