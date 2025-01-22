import { clientConstants } from 'src/client-constants'
import parse from 'html-react-parser'
import { Collapse } from 'antd'
import { CommonEndpoints, Status, UserSettingKey } from 'common-types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AppDispatch, markInfoItemAsRead } from 'src/store'
import { UIIcon } from '..'
import { useApi } from 'src/services'
import { WidgetWrapper } from '../shared'

export const InfoList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { updateSetting } = useUpdateSettings()
  const { currentInfoId } = useTypedSelector((state) => state.persist.settings)
  const { infoItems } = useTypedSelector((state) => state.user.userData)
  const { doRequest } = useApi()
  const markInfoAsRead = async () => {
    if (!currentInfoId) return
    const response = await doRequest('post', CommonEndpoints.GET_INFO, { currentInfoId })
    if (!response || response.status !== Status.success) return
    dispatch(markInfoItemAsRead({ id: currentInfoId }))
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      const foundEl = infoItems?.find(infoItem => infoItem.id === currentInfoId)
      if (foundEl && !foundEl.read) markInfoAsRead()
    }, clientConstants.infoItemMarkAsReadDuration)
    return () => clearTimeout(timerId)
  }, [currentInfoId, infoItems])

  const onChange = (key: string | string[]) => {
    if (key instanceof Array) {
      key.forEach((keyElement) => {
        updateSetting(UserSettingKey.currentInfoId, { infoId: keyElement })
      })
      return
    }
    updateSetting(UserSettingKey.currentInfoId, { infoId: key ?? null })
  }

  return (
    <div className="info-list">
      <WidgetWrapper wallpaperPlacement="main">
        <div className="info-list__header header-text header-text--md header-text--secondary">Info messages</div>
        <Collapse activeKey={currentInfoId} onChange={onChange} bordered={false} accordion={true}>
          {infoItems?.map((item) => {
            return (
              <Collapse.Panel
                header={item.label}
                key={item.id}
                extra={item.read === 'unread' && <UIIcon name="exclamation" color="success" />}
              >
                {parse(item.content)}
              </Collapse.Panel>
            )
          })}
        </Collapse>
      </WidgetWrapper>
    </div>
  )
}
