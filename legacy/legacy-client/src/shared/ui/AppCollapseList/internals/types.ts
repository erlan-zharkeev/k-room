import { FC } from 'react'

export interface CollapseItem {
  id: string
  title: string
  content?: FC
  badgeName?: React.ReactNode
}

export interface AppCollapseProps {
  items: CollapseItem[]
  onClickCollapseEl: (id: string) => void
}
