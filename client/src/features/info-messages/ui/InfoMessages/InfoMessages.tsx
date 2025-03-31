import { CommonEndpointsEnum, StatusEnum } from 'common-types'
import { parse } from 'path'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { useSettings } from 'src/entities/settings'
import { useUser, markInfoItemAsRead } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { AppCollapse, AppIcon } from 'src/shared/ui'

const INFO_ITEM_MARK_AS_READ_DURATION_IN_SEC = 1.5

export const InfoMessages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { updateSetting, currentInfoId } = useSettings()
  const { infoItems } = useUser()
  const { doRequest } = useApi()

  const markInfoAsRead = async () => {
    if (!currentInfoId) return
    const response = await doRequest('post', CommonEndpointsEnum.GetInfo, { currentInfoId })
    if (!response || response.status !== StatusEnum.Success) return
    dispatch(markInfoItemAsRead({ id: currentInfoId }))
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      const foundEl = infoItems?.find((infoItem) => infoItem.id === currentInfoId)
      if (foundEl && foundEl.read === 'unread') markInfoAsRead()
    }, INFO_ITEM_MARK_AS_READ_DURATION_IN_SEC * 1000)
    return () => clearTimeout(timerId)
  }, [currentInfoId, infoItems])

  const onChange = (key: string | string[]) => {
    if (Array.isArray(key)) {
      key.forEach((keyElement) => {
        updateSetting('currentInfoId', { infoId: keyElement })
      })
    } else {
      updateSetting('currentInfoId', { infoId: key ?? null })
    }
  }

  // extra: item.read === 'unread' && <AppIcon name="exclamation" color="success-color" />

  const items = useMemo(
    () =>
      infoItems?.map((item) => ({
        id: item.id,
        title: item.label,
        content: item.content
      })) ?? [],
    [infoItems]
  )

  return (
    <div className="info-messages">
      <AppCollapse items={items} />
    </div>
  )
}
