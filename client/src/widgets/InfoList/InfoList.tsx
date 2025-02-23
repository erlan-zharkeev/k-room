import './style.scss'
import parse from 'html-react-parser'
import { Collapse } from 'antd'
import { CommonEndpoints, Status } from 'common-types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { useApi } from 'src/shared/api'
import { Icon } from 'src/shared/ui'
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'
import { markInfoItemAsRead } from 'src/entities/user'
import { useSettings } from 'src/entities/settings'
import { useTypedSelector } from 'src/shared/lib'

const INFO_ITEM_MARK_AS_READ_DURATION_IN_SEC = 1.5

export const InfoList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { updateSetting } = useSettings()
  const { currentInfoId } = useTypedSelector((state) => state.persist.settings)
  const { infoItems } = useTypedSelector((state) => state.user.userData)
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
    if (key instanceof Array) {
      key.forEach((keyElement) => {
        updateSetting('currentInfoId', { infoId: keyElement })
      })
      return
    }
    updateSetting('currentInfoId', { infoId: key ?? null })
  }

  return (
    <div className="info-list">
      <WidgetWrapper placement="main">
        <div className="info-list__header header-text header-text--md header-text--secondary">Info messages</div>
        <Collapse activeKey={currentInfoId} onChange={onChange} bordered={false} accordion={true}>
          {infoItems?.map((item) => {
            return (
              <Collapse.Panel
                header={item.label}
                key={item.id}
                extra={item.read === 'unread' && <Icon name="exclamation" color="success" />}
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
