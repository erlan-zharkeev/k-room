import { Collapse } from 'antd'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import parse from 'html-react-parser'
import { setCurrentInfoItem } from 'src/store/settingsSlice'
import apiMethods from 'src/services/api-methods'
import { AsyncThunkResponseWrapper } from 'src/@types'
import { Status } from 'common-types'
import { markInfoItemAsRead } from 'src/store/userSlice'
import { UIIcon } from '../UI'

const InfoList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentInfoId } = useTypedSelector((state) => state.persist.settings)
  const { infoItems, id } = useTypedSelector((state) => state.user.userData)

  const markInfoAsRead = async () => {
    if (!currentInfoId) return
    const response = (await dispatch(
      apiMethods.common.markInfoAsRead({ currentInfoId, userId: id })
    )) as AsyncThunkResponseWrapper
    if (response.payload.status !== Status['success']) return
    dispatch(markInfoItemAsRead({ id: currentInfoId }))
  }

  useEffect(() => {
    markInfoAsRead()
  }, [currentInfoId])

  const onChange = (key: string | string[]) => {
    dispatch(setCurrentInfoItem(key))
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

export default InfoList
