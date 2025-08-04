import { FC } from 'react'

export interface ICollapseItem {
  id: string
  title: string
  content?: FC
  badgeName?: React.ReactNode
}

export interface IAppCollapseProps {
  items: ICollapseItem[]
  onClickCollapseEl: (id: string) => void
}
