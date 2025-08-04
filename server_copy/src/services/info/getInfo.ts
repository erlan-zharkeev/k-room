import type { IInfoNotification } from 'common-types'
import { welcome } from './items'

const infoMap: Record<string, IInfoNotification> = {
  1: {
    id: '1',
    label: 'Welcome to K-Room',
    read: false,
    content: welcome()
  }
}

export const getPreviewInfoNotification = (id: string) => {
  const item = infoMap[id]
  return {
    id: item.id,
    label: item.label,
    read: item.read
  }
}

export const getInfoItem = (id: string) => {
  const item = infoMap[id]

  return {
    id: item.id,
    content: item.content
  }
}
