import { IMessage } from 'common'

import { AppText } from 'src/shared/ui'

export const MessageNotification = (message: IMessage) => {
  return (
    <>
      <AppText size="large" tag="p">
        {message.authorName}
      </AppText>
      <AppText>{message.body}</AppText>
    </>
  )
}
