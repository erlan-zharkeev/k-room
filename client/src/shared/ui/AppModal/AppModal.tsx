import './style.scss'

import { useEffect, useId, useMemo, useRef } from 'react'

import { createPortal } from 'react-dom'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { AppButton, AppHeader, APP_MODAL_I18N, MODAL_WIDTH, IAppModalProps } from 'src/shared/ui'

import { useViewport } from '../../system'

export const AppModal = ({
  title,
  open,
  onClose,
  children,
  headerExtra,
  className,
  okAction,
  cancelAction,
  actions
}: IAppModalProps) => {
  const { lessOrEqualPhone } = useViewport()
  const { t } = useI18n()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

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
    dialogRef.current?.focus()
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const dialogContent = (
    // Stop propagation keeps overlay-close behavior on the backdrop without changing dialog semantics.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={dialogRef}
      className={modalClassName}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      tabIndex={-1}
      onClick={(evt) => evt.stopPropagation()}
      style={{ width: `${modalWidth}px` }}
    >
      {(title || headerExtra) && (
        <div className="app-modal__header">
          <div className="app-modal__title">
            {typeof title === 'string' ? (
              <div id={titleId}>
                <AppHeader tag="h4">{title}</AppHeader>
              </div>
            ) : (
              title && <div id={titleId}>{title}</div>
            )}
            {headerExtra}
          </div>
          <AppButton prefixIconName="cross" borderless onClick={onClose} ariaLabel={t(APP_MODAL_I18N.close)} />
        </div>
      )}
      <div className="app-modal__content">{children}</div>
      {(actions || okAction || cancelAction) && (
        <div className="app-modal__actions">
          {actions ?? (
            <>
              {cancelAction && (
                <AppButton
                  text={cancelAction.text ?? t(APP_MODAL_I18N.cancel)}
                  onClick={cancelAction.onClick}
                  loading={cancelAction.loading}
                  disabled={cancelAction.disabled}
                  htmltype={cancelAction.htmltype}
                  fill
                />
              )}
              {okAction && (
                <AppButton
                  text={okAction.text ?? t(APP_MODAL_I18N.ok)}
                  onClick={okAction.onClick}
                  loading={okAction.loading}
                  disabled={okAction.disabled}
                  color={okAction.color}
                  htmltype={okAction.htmltype}
                  fill
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )

  const modalLayer = (
    <div className="app-modal-layer" role="presentation" onClick={onClose}>
      {dialogContent}
    </div>
  )

  return createPortal(modalLayer, document.body)
}
