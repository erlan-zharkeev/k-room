import { type FC } from 'react'

import { type LocalizedTextType } from 'common-types'

export interface IInfoNotificationItem {
  id: number
  title: LocalizedTextType
  content: FC
}
