import './style.scss'

export const Calls = () => {
  // const { list, currentCall } = useTypedSelector((state) => state.calls)
  // const getFlowType = (call: ICall) => (currentCall.id === call.id ? 'current' : call.type)
  // const [sortedList, setSortedList] = useState(list)
  // const getCallTypeName = (call: ICall) => {
  //   const type = getFlowType(call)
  //   return type === 'not-answered' ? 'Not answered' : firstCharUpperCase(type)
  // }
  // useEffect(() => {
  //   const tempList = [...list]
  //   tempList.sort((a, b) => (a.calledAt ?? 0) - (b.calledAt ?? 0)).reverse()
  //   setSortedList(tempList)
  // }, [list])

  return (
    <div className="call-list">
      <div className="call-list__body">
        {/* <List
          itemLayout="horizontal"
          dataSource={sortedList}
          locale={{
            emptyText: <div className="paragraph-text  call-list__empty-title">There are no calls yet</div>
          }}
          renderItem={(call) => (
            <List.Item className={`call-list__item call-list__item--${getFlowType(call)}`}>
              <List.Item.Meta
                avatar={<AppAvatar src={call.interlocutorAvatarPath} showBadge={false} />}
                title={<span>{call.interlocutorName}</span>}
                description={
                  <div className={`call-list__info call-list__info--${getFlowType(call)} paragraph-text`}>
                    <AppIcon name={call.video ? 'video-call-thin' : 'call'} />
                    <p className="call-list__type paragraph-text">
                      {getCallTypeName(call)}
                      {call.length && <div className="call-list__length">&nbsp;{getCallLength(call.length)}</div>}
                    </p>
                  </div>
                }
              />
              <div className="call-list__additional-info">
                {call.calledAt && (
                  <div className="call-list__called-at">
                    <p className="paragraph-text">{callDate(call.calledAt)}</p>
                    <p className="paragraph-text">{callTime(call.calledAt)}</p>
                  </div>
                )}
              </div>
            </List.Item>
          )}
        /> */}
      </div>
    </div>
  )
}
