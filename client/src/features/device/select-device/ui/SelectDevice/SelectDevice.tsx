import './style.scss'

import { ReactNode, useMemo } from 'react'

import { AppButton, AppIconName, AppSelect, type IAppSelectOption } from 'src/shared/ui'

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
  options: IAppSelectOption[]
  value: string
  onChange: (value: string) => void
  loading: boolean
}) => {
  const isOptionsEmpty = useMemo(() => options.length === 0, [options])

  return (
    <div className="select-device">
      <div className="select-device__title header-text">{title}</div>
      {isOptionsEmpty ? (
        <div className="paragraph-text">Permissions were not granted or the devices were not detected.</div>
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
