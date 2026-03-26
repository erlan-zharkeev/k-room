import './style.scss'

import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

import { createPortal } from 'react-dom'

import { useViewport } from 'src/entities/system'

import { AppButton, AppHeader } from 'src/shared/ui'
import { MODAL_WIDTH } from 'src/shared/ui/AppModal/config'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppModal = ({
  title,
  open,
  onClose,
  children,
  headerExtra,
  className
}: {
  title?: ReactNode
  open: boolean
  onClose: () => void
  children: ReactNode
  headerExtra?: ReactNode
  className?: string
}) => {
  const { lessOrEqualPhone } = useViewport()

  const modalWidth = useMemo(() => {
    if (lessOrEqualPhone) return MODAL_WIDTH.PHONE
    return MODAL_WIDTH.GREATER_THAN_PHONE
  }, [lessOrEqualPhone])
  const modalClassName = createClassNameWithModifiers({
    rootClass: 'app-modal',
    modifiers: [],
    additionalClassName: className
  })

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="app-modal-layer" role="presentation" onClick={onClose}>
      <div
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        onClick={(evt) => evt.stopPropagation()}
        style={{ width: `${modalWidth}px` }}
      >
        {(title || headerExtra) && (
          <div className="app-modal__header">
            <div className="app-modal__title">
              {typeof title === 'string' ? <AppHeader tag="h4">{title}</AppHeader> : title}
              {headerExtra}
            </div>
            <AppButton prefixIconName="cross" borderless onClick={onClose} />
          </div>
        )}
        <div className="app-modal__content">{children}</div>
      </div>
    </div>,
    document.body
  )
}
