import { useEffect, useRef } from 'react'

import type { IAppClickOutsideProps } from 'src/shared/ui'

export const AppClickOutside = ({
  children,
  onClickOutside,
  active = true,
  additionalClassName
}: IAppClickOutsideProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node)) return
      if (rootRef.current?.contains(target)) return

      onClickOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [active, onClickOutside])

  return (
    <div className={additionalClassName} ref={rootRef}>
      {children}
    </div>
  )
}
