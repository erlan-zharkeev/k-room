import './style.scss'
import { useEffect, useRef, useState } from 'react'

import { useTimeout } from 'src/shared/lib'
import { createClassNameWithModifiers } from 'src/shared/utils'

import type { IAppScrollContainerProps } from './config'

export const AppScrollContainer = ({
  height = '300px',
  children,
  additionalClassName,
  id
}: IAppScrollContainerProps) => {
  const [showScrollbar, setShowScrollbar] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { startTimeout } = useTimeout()

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      setShowScrollbar(true)
      startTimeout(() => setShowScrollbar(false), 1000)
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [startTimeout])

  const className = createClassNameWithModifiers({
    rootClass: 'app-scroll-container',
    modifiers: [showScrollbar && 'show'],
    additionalClassName
  })

  return (
    <div id={id ?? String(Date.now())} ref={scrollRef} className={className} style={{ maxHeight: height }}>
      {children}
    </div>
  )
}
