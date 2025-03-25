import './style.scss'
import { AppFormItemProps } from './types'

export const AppFormItem = ({ name, children, label, errors = [], required }: AppFormItemProps) => {
  const error = errors.length > 0 && errors[0]
  return (
    <div className="app-form-item">
      <label htmlFor={name} className="app-form-item__label">
        {label} {required && <span className="app-form-item__required">*</span>}
      </label>
      {children}
      {<div className={`app-form-item__error ${error ? 'app-form-item__error--active' : ''}`}>{error ?? ''}</div>}
    </div>
  )
}
