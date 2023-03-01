import { Input } from 'antd'
import UIInputProps from 'ui/UIInput/@types/UIInputProps'

const inputTypes = [
  { name: 'common', component: Input },
  { name: 'password', component: Input.Password }
]

export const UIInput = ({ type, placeholder, size, value, suffix, autoComplete, onChange }: UIInputProps) => {
  const inputType = type ?? 'common'
  const InputComponent = inputTypes.find((input) => input.name === inputType).component
  return (
    <div className="ui-input">
      <InputComponent
        size={size}
        autoComplete={autoComplete}
        placeholder={placeholder}
        suffix={suffix}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

export default UIInput
