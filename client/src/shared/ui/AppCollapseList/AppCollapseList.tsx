import './style.scss'
import { useEffect, useRef, useState } from 'react'

import { Badge } from 'antd'
import parse from 'html-react-parser'

import { useTimeout } from 'src/shared/lib'

import { AppHeader } from '../AppHeader/AppHeader'
import { AppIcon } from '../AppIcon'

import type { IAppCollapseProps } from './types'

export const AppCollapseList = ({ items, onClickCollapseEl }: IAppCollapseProps) => {
  const [openElId, setOpenIElId] = useState<string | null>(null)
  const [delayedOverflowIndex, setDelayedOverflowIndex] = useState<string | null>(null)
  const { startTimeout } = useTimeout()
  const contentBodyDOM = useRef<HTMLDivElement>(null)

  const clickHandler = (id: string) => {
    setOpenIElId((prev) => (prev === id ? null : id))
    onClickCollapseEl(id)
  }

  useEffect(() => {
    if (openElId !== null) {
      startTimeout(() => setDelayedOverflowIndex(openElId), 300)
    } else {
      setDelayedOverflowIndex(null)
    }
  }, [openElId])

  return (
    <div className="app-collapse-list">
      {items.map((item) => {
        const isOpen = openElId === item.id
        const showOverflow = delayedOverflowIndex === item.id
        return (
          <Badge color={'var(--error)'} count={item.badgeName} offset={[-5, 2]} key={item.id}>
            <div
              className={`app-collapse-list__element ${isOpen ? 'app-collapse-list__element--open' : ''}`}
              onClick={() => clickHandler(item.id)}
            >
              <div className="app-collapse-list__element-header">
                <AppHeader bold={false} tag="h4">
                  {item.title}
                </AppHeader>
                <div className="app-collapse-list__element-header-right-side">
                  <div className="app-collapse-list__element-chevron-icon">
                    <AppIcon name="arrow-left" size="xs" />
                  </div>
                </div>
              </div>
              <div
                className="app-collapse-list__element-content"
                style={{
                  overflow: showOverflow ? 'auto' : 'hidden',
                  height: isOpen ? `${contentBodyDOM.current?.clientHeight}px` : '0'
                }}
              >
                <div ref={contentBodyDOM} className="app-collapse-list__element-content-body">
                  {parse(item.content ?? '<p>Сouldn`t get the data, try later</p>')}
                </div>
              </div>
            </div>
          </Badge>
        )
      })}
    </div>
  )
}
