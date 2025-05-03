import { useEffect, useMemo, useRef, useState } from 'react'

import { CommonEndpointsEnum, StatusEnum } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useContentTabSelect } from 'src/features/content-tab/select-content-tab'

import { useUser, markInfoNotificationAsRead, updateInfoNotificationContent } from 'src/entities/user'

import { useApi } from 'src/shared/api'

const INFO_ITEM_MARK_AS_READ_DURATION_IN_SEC = 1.5

export const useInfoNotification = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { infoNotifications } = useUser()
  const { doRequest } = useApi()
  const [isInfoItemLoading, setIsInfoItemLoading] = useState(false)
  const { selectContentTab } = useContentTabSelect()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const markInfoAsRead = async (id: string) => {
    const response = await doRequest('post', CommonEndpointsEnum.InfoItem, { id })
    if (!response || response.status !== StatusEnum.Success) return
    dispatch(markInfoNotificationAsRead({ id }))
  }

  const infoNotificationClickHandler = (id: string) => {
    selectContentTab('info')

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    const foundEl = infoNotifications?.find((infoItem) => infoItem.id === id)
    if (foundEl && !foundEl.read) {
      timerRef.current = setTimeout(() => {
        markInfoAsRead(id)
      }, INFO_ITEM_MARK_AS_READ_DURATION_IN_SEC * 1000)
    }
  }

  const getInfoItemContent = async () => {
    const elementIdsWithoutContent = infoNotifications.filter((item) => !item.content).map((item) => item.id)
    if (!elementIdsWithoutContent.length) return

    try {
      setIsInfoItemLoading(true)
      const ids = elementIdsWithoutContent.join(',')
      const response = await doRequest('get', `${CommonEndpointsEnum.InfoItem}?ids=${ids}` as CommonEndpointsEnum)
      if (!response || response.status !== StatusEnum.Success || !response.data) return
      dispatch(updateInfoNotificationContent(response.data))
    } catch (error: unknown) {
      console.error('Error fetching info item content:', error)
    } finally {
      setIsInfoItemLoading(false)
    }
  }

  const collapseInfoNotifications = useMemo(() => {
    const result =
      infoNotifications?.map((item) => ({
        id: item.id,
        title: item.label,
        content: item.content,
        badgeName: item.read ? undefined : 'Unread'
      })) ?? []
    return result
  }, [infoNotifications])

  useEffect(() => {
    getInfoItemContent()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [infoNotifications])

  return { collapseInfoNotifications, isInfoItemLoading, infoNotificationClickHandler }
}
