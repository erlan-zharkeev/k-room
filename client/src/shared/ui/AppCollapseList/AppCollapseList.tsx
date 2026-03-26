import './style.scss'
import { useEffect, useRef, useState } from 'react'

import { Badge } from 'antd'

import { useTimeout } from 'src/shared/lib'
import type { IAppCollapseProps } from 'src/shared/ui/AppCollapseList/config'
import { AppHeader } from 'src/shared/ui/AppHeader/AppHeader'
import { AppIcon } from 'src/shared/ui/AppIcon'
import { createClassNameWithModifiers } from 'src/shared/utils'

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
      {items.map(({ id, title, content: Content, badgeName }) => {
        const isOpen = openElId === id
        const showOverflow = delayedOverflowIndex === id
        const className = createClassNameWithModifiers({
          rootClass: 'app-collapse-list__element',
          modifiers: [isOpen && 'open']
        })
        return (
          <Badge color={'var(--error)'} count={badgeName} offset={[-5, 2]} key={id}>
            <div className={className} onClick={() => clickHandler(id)}>
              <div className="app-collapse-list__element-header">
                <AppHeader bold={false} tag="h4">
                  {title}
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
                  {Content && <Content />}
                </div>
              </div>
            </div>
          </Badge>
        )
      })}
    </div>
  )
}
