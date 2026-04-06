import './style.scss'

import { ReactNode } from 'react'

import { SELECT_DEVICE_I18N } from 'src/features/device'

import { useI18n } from 'src/shared/settings'
import { AppButton, AppSelect, AppText, IAppSelectOption, AppIconNameType } from 'src/shared/ui'

export const SelectDevice = ({
  title,
  actionHandler,
  isErrorColor,
  prefixIconName,
  children,
  options,
  value,
  onChange,
  loading
}: {
  title: string
  actionHandler: () => void
  isErrorColor: boolean
  prefixIconName: AppIconNameType
  children?: ReactNode
  options: IAppSelectOption[]
  value: string
  onChange: (value: string) => void
  loading: boolean
}) => {
  const isOptionsEmpty = options.length === 0
  const { t } = useI18n()

  return (
    <div className="select-device">
      <AppText additionalClassName="select-device__title">{title}</AppText>
      {isOptionsEmpty ? (
        <AppText size="small">{t(SELECT_DEVICE_I18N.notAvailable)}</AppText>
      ) : (
        <>
          <div className="select-device__select-wrapper">
            <AppSelect options={options} value={value} onChange={onChange} loading={loading} disabled={false} />
            <AppButton
              onClick={actionHandler}
              prefixIconName={prefixIconName}
              borderless
              color={isErrorColor ? 'error-color' : 'accent-color'}
            />
          </div>
          {children}
        </>
      )}
    </div>
  )
}
