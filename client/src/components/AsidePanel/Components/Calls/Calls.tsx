import { List } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { firstCharUpperCase } from 'src/utils/firstCharUpperCase'
import moment from 'moment'
import useDynamicRefs from 'use-dynamic-refs'
import { UIAvatar, UIIcon, UIButton } from 'src/components/UI'

const Calls = () => {
  const { list } = useTypedSelector((state) => state.calls)
  const [getRef, setRef] = useDynamicRefs() as any
  const itemClickHandler = (id: string) => {
    const el = getRef(id).current
    el.classList.toggle('call-list__item--expand')
  }
  return (
    <div className="call-list">
      <div className="call-list__body">
        <List
          itemLayout="horizontal"
          dataSource={list}
          locale={{
            emptyText: <div className="paragraph-text paragraph-text--secondary">There are no calls yet</div>
          }}
          renderItem={(call) => (
            <List.Item className="call-list__item" ref={setRef(call.interlocutorId)}>
              <List.Item.Meta
                avatar={<UIAvatar src={call.interlocutorAvatarPath} showBadge={false} />}
                title={<span>{call.interlocutorName}</span>}
                description={
                  <div
                    className={`call-list__info call-list__info--${call.type} paragraph-text paragraph-text--secondary`}
                  >
                    <UIIcon name={call.video ? 'video-call' : 'phone-call'} />
                    <p className="paragraph-text paragraph-text--secondary">{firstCharUpperCase(call.type)}</p>
                  </div>
                }
              />
              <div className="call-list__additional-info-button">
                <UIButton iconName="info" onClick={() => itemClickHandler(call.interlocutorId)} tooltip="info" />
              </div>
              {call.length && (
                <div className="call-list__length">
                  <p className="paragraph-text paragraph-text--secondary">
                    {moment.utc(call.length * 1000).format('mm:ss')}
                  </p>
                </div>
              )}
              <div className="call-list__additional-info">
                <p className="paragraph-text paragraph-text--secondary">
                  <span>Started at: </span>
                  <span>{moment.unix(call.startedAt).format('hh.mm MM.DD.YYYY')}</span>
                </p>
                {call.finishedAt && (
                  <p className="paragraph-text paragraph-text--secondary">
                    <span>Finished at: </span>
                    <span>{moment.unix(call.finishedAt).format('hh.mm MM.DD.YYYY')}</span>
                  </p>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}
export default Calls
