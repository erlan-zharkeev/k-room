import { FC } from 'react'

import { LocalizedTextType } from 'common'

export interface IInfoNotificationItem {
  id: string
  title: LocalizedTextType
  content: FC
}
