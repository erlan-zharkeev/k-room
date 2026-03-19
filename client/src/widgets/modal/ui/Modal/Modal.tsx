import './style.scss'
import { useMemo } from 'react'

import { Modal as AntdModal } from 'antd'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { closeModal, useSystem, useViewport } from 'src/entities/system'

import { AppButton, AppHeader, AppText } from 'src/shared/ui'

import { AdditionalDropdownMenuElements, Popups } from '../../config'

export const Modal = () => {
  const { showModal, modalData } = useSystem()
  const { lessOrEqualPhone } = useViewport()
  const dispatch = useDispatch<AppDispatch>()

  const ComponentContent = modalData.modalContentComponentName ? (
    Popups[modalData.modalContentComponentName]
  ) : (
    <AppText>{modalData.textContent ?? ''}</AppText>
  )

  const modalWidth = useMemo(() => {
    if (lessOrEqualPhone) return 300
    return 420
  }, [lessOrEqualPhone])

  return (
    <AntdModal
      centered
      title={
        <div className="modal__title">
          <AppHeader tag="h4">{modalData.title}</AppHeader>
          {modalData.modalContentComponentName && AdditionalDropdownMenuElements[modalData.modalContentComponentName]}
        </div>
      }
      open={showModal}
      footer={null}
      onCancel={() => dispatch(closeModal())}
      destroyOnClose
      width={modalWidth}
      className="modal"
    >
      {ComponentContent}
      {modalData.textContent && (
        <div className="modal__confirmation-actions">
          <AppButton
            onClick={modalData.confirmBtn?.callback ?? (() => dispatch(closeModal()))}
            loading={modalData.confirmBtn?.loader}
            color="accent-color"
            text={modalData.confirmBtn?.text ?? 'OK'}
            fill
          />
          <AppButton
            onClick={modalData.cancelBtn?.callback ?? (() => dispatch(closeModal()))}
            loading={modalData.cancelBtn?.loader}
            text={modalData.cancelBtn?.text ?? 'Cancel'}
            fill
          />
        </div>
      )}
    </AntdModal>
  )
}
