import './style.scss'
import { CommonEndpoints, Status } from 'common-types'
import { parse } from 'path'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { useSettings } from 'src/entities/settings'
import { useUser, markInfoItemAsRead } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { AppIcon } from 'src/shared/ui'
import { Collapse } from 'antd'

const INFO_ITEM_MARK_AS_READ_DURATION_IN_SEC = 1.5

export const InfoMessages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { updateSetting, currentInfoId } = useSettings()
  const { infoItems } = useUser()
  const { doRequest } = useApi()

  const markInfoAsRead = async () => {
    if (!currentInfoId) return
    const response = await doRequest('post', CommonEndpoints.GetInfo, { currentInfoId })
    if (!response || response.status !== Status.Success) return
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

  const items = useMemo(
    () =>
      infoItems?.map((item) => ({
        key: item.id,
        label: item.label,
        children: parse(item.content),
        extra: item.read === 'unread' && <AppIcon name="exclamation" color="success-color" />
      })) ?? [],
    [infoItems]
  )

  return (
    <div className="info-messages">
      <Collapse items={items} activeKey={currentInfoId} onChange={onChange} bordered={false} />
    </div>
  )
}
