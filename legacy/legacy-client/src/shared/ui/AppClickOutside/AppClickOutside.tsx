import { useEffect, useRef } from 'react'

import { AppClickOutsideProps } from 'src/shared/ui/AppClickOutside/internals/types'

export const AppClickOutside = ({
  children,
  onClickOutside,
  active = true,
  additionalClassName
}: AppClickOutsideProps) => {
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
