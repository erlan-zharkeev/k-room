import { List } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { firstCharUpperCase } from 'src/utils/firstCharUpperCase'
import moment from 'moment'
import { UIAvatar, UIIcon } from 'src/components/UI'
import { CallType } from 'common-types'

const Calls = () => {
  const { list } = useTypedSelector((state) => state.calls)
  const getCallType = (type: CallType) => (type === CallType.notAnswered ? 'Not answered' : firstCharUpperCase(type))

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
            <List.Item className={`call-list__item call-list__item--${call.type}`}>
              <List.Item.Meta
                avatar={<UIAvatar src={call.interlocutorAvatarPath} showBadge={false} />}
                title={<span>{call.interlocutorName}</span>}
                description={
                  <div
                    className={`call-list__info call-list__info--${call.type} paragraph-text paragraph-text--secondary`}
                  >
                    <UIIcon name={call.video ? 'video-call-thin' : 'phone-call'} />
                    <p className="call-list__type paragraph-text paragraph-text--secondary">
                      {getCallType(call.type)}
                      {call.length && (
                        <div className="call-list__length">
                          &nbsp;({moment.utc(call.length * 1000).format('mm:ss')})
                        </div>
                      )}
                    </p>
                  </div>
                }
              />
              <div className="call-list__additional-info">
                {call.calledAt && (
                  <div className="call-list__called-at">
                    <p className="paragraph-text paragraph-text--secondary">
                      {moment.utc(call.calledAt).format('MMMM Do YYYY')}
                    </p>
                    <p className="paragraph-text paragraph-text--secondary">
                      {moment.utc(call.calledAt * 1000).format('LTS')}
                    </p>
                  </div>
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
