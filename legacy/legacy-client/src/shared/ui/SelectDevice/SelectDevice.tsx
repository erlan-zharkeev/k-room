import './style.scss'

import { ReactNode } from 'react'

import { useI18n } from 'src/shared/preferences'

import { AppButton } from '../AppButton/AppButton'
import { AppIconName } from '../AppIcon/internals/types'
import { AppSelect } from '../AppSelect/AppSelect'
import { AppSelectOption } from '../AppSelect/internals/types'
import { AppText } from '../AppText/AppText'

import { SELECT_DEVICE_I18N } from './i18n'

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
  prefixIconName: AppIconName
  children?: ReactNode
  options: AppSelectOption[]
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
