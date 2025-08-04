import { useMemo, useRef } from 'react'

import { useContentTabSelect } from 'src/features/content-tab'

// import { useTimeout } from 'src/shared/lib'

// import { INFO_ITEM_MARK_AS_READ_DURATION } from '../config'
import { WelcomeInfoNotification } from '../ui'

const map = {
  1: {
    id: 1,
    title: 'Welcome to K-Room',
    content: WelcomeInfoNotification
  }
}

export const useInfoNotification = () => {
  const { selectContentTab } = useContentTabSelect()
  // const { startTimeout } = useTimeout()

  // TODO Будет приходить с бэка
  const unread = useRef<string[]>([])

  const markInfoAsRead = async (id: string) => {
    //
  }

  const infoNotificationClickHandler = (id: string) => {
    selectContentTab('info')
    //
  }

  const collapseInfoNotifications = useMemo(() => {
    const result =
      Object.entries(map)?.map(([id, info]) => ({
        id,
        title: info.title,
        content: info.content,
        badgeName: unread.current.includes(id) ? 'Unread' : undefined
      })) ?? []
    return result
  }, [unread])

  return { collapseInfoNotifications, infoNotificationClickHandler }
}
