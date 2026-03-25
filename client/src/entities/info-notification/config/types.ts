import { type FC } from 'react'

import { type LocalizedTextType } from 'common'

export interface IInfoNotificationItem {
  id: number
  title: LocalizedTextType
  content: FC
}
