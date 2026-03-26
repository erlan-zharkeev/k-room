import './style.scss'
import type { IAppFormItemProps } from 'src/shared/ui/AppFormItem/config'
import { AppText } from 'src/shared/ui/AppText/AppText'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppFormItem = ({ children, label, errors = [], required }: IAppFormItemProps) => {
  const error = errors.length > 0 && errors[0]
  const errorClassName = createClassNameWithModifiers({
    rootClass: 'app-form-item__error',
    modifiers: [error && 'active']
  })
  return (
    <div className="app-form-item">
      {children && (
        <div className="app-form-item__label">
          <AppText>
            {label} {required && <span className="app-form-item__required">*</span>}
          </AppText>
        </div>
      )}
      {children}
      {<div className={errorClassName}>{error ?? ''}</div>}
    </div>
  )
}
