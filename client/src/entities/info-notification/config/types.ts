import { FC } from 'react'

import { LocalizedTextType } from 'common'

export interface IInfoNotificationItem {
  id: number
  title: LocalizedTextType
  content: FC
}
