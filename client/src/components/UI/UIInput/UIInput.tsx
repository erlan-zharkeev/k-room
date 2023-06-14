import { Input } from 'antd'
import modifiersHandler from 'src/utils/modifiersHandler'
import { UIInputProps } from 'ui/UIInput/@types/UIInputProps'

const inputTypes = [
  { name: 'common', component: Input },
  { name: 'password', component: Input.Password }
]

const UIInput = ({ type, placeholder, size, value, suffix, autoComplete, disabled, onChange }: UIInputProps) => {
  const inputType = type ?? 'common'
  const InputComponent = inputTypes.find((input) => input.name === inputType)?.component
  const className = modifiersHandler({ rootClass: 'ui-input', modifiers: [size] })
  return (
    <div className={className}>
      {InputComponent && (
        <InputComponent
          disabled={disabled}
          size={size}
          autoComplete={autoComplete}
          placeholder={placeholder}
          suffix={suffix}
          onChange={onChange}
          value={value}
        />
      )}
    </div>
  )
}

export default UIInput
