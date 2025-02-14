import { List } from 'antd'
import { Call } from 'common-types'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { UIAvatar, UIIcon } from 'src/components'
import { useTypedSelector } from 'src/hooks'
import { firstCharUpperCase } from 'src/utils'

export const Calls = () => {
  const { list, currentCall } = useTypedSelector((state) => state.calls)
  const getCallType = (call: Call) => (currentCall.id === call.id ? 'current' : call.type)
  const [sortedList, setSortedList] = useState(list)
  const getCallTypeName = (call: Call) => {
    const type = getCallType(call)
    return type === 'not-answered' ? 'Not answered' : firstCharUpperCase(type)
  }
  useEffect(() => {
    const tempList = [...list]
    tempList.sort((a, b) => (a.calledAt ?? 0) - (b.calledAt ?? 0)).reverse()
    setSortedList(tempList)
  }, [list])

  return (
    <div className="call-list">
      <div className="call-list__body">
        <List
          itemLayout="horizontal"
          dataSource={sortedList}
          locale={{
            emptyText: (
              <div className="paragraph-text paragraph-text--secondary call-list__empty-title">
                There are no calls yet
              </div>
            )
          }}
          renderItem={(call) => (
            <List.Item className={`call-list__item call-list__item--${getCallType(call)}`}>
              <List.Item.Meta
                avatar={<UIAvatar src={call.interlocutorAvatarPath} showBadge={false} />}
                title={<span>{call.interlocutorName}</span>}
                description={
                  <div
                    className={`call-list__info call-list__info--${getCallType(
                      call
                    )} paragraph-text paragraph-text--secondary`}
                  >
                    <UIIcon name={call.video ? 'video-call-thin' : 'phone-call'} />
                    <p className="call-list__type paragraph-text paragraph-text--secondary">
                      {getCallTypeName(call)}
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
                      {moment(call.calledAt).format('H:mm:ss')}
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
