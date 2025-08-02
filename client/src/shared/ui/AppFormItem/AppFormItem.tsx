import './style.scss'
import { AppText } from '../AppText/AppText'

import type { IAppFormItemProps } from './types'

export const AppFormItem = ({ children, label, errors = [], required }: IAppFormItemProps) => {
  const error = errors.length > 0 && errors[0]
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
      {<div className={`app-form-item__error${error ? ' app-form-item__error--active' : ''}`}>{error ?? ''}</div>}
    </div>
  )
}
