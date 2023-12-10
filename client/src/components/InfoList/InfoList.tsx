import { clientConstants } from 'src/client-constants'
import parse from 'html-react-parser'
import { Collapse } from 'antd'
import { Status, UserSettingKey } from 'common-types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AsyncThunkResponseWrapper } from 'src/@types'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AppDispatch, markInfoItemAsRead } from 'src/store'
import { UIIcon } from '..'
import { apiMethods } from 'src/services'

export const InfoList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { updateSetting } = useUpdateSettings()
  const { currentInfoId } = useTypedSelector((state) => state.persist.settings)
  const { infoItems } = useTypedSelector((state) => state.user.userData)

  const markInfoAsRead = async () => {
    if (!currentInfoId) return
    const response = (await dispatch(apiMethods.common.markInfoAsRead({ currentInfoId }))) as AsyncThunkResponseWrapper
    if (response.payload.status !== Status.success) return
    dispatch(markInfoItemAsRead({ id: currentInfoId }))
  }

  useEffect(() => {
    setTimeout(() => {
      markInfoAsRead()
    }, clientConstants.infoItemMarkAsReadDuration)
  }, [currentInfoId])

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
      <div className="info-list__header header-text header-text--md header-text--secondary">Notifications</div>
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
    </div>
  )
}
