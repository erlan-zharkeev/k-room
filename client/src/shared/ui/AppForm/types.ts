import { SwitchValidateRule, TextInputValidateRule } from 'src/shared/lib'
import { AppInputProps } from '../AppInput/AppInput'
import { AppSwitchProps } from '../AppSwitch/AppSwitch'

export type AppFormFieldValue = string | boolean

export type AppFormSwitchField = {
  inputType: 'switch'
  rule?: SwitchValidateRule
} & Omit<AppSwitchProps, 'name'>

export type AppFormTextInputField = {
  inputType?: 'text'
  rule?: TextInputValidateRule
} & Omit<AppInputProps, 'name'>

export type AppFormField = AppFormTextInputField | AppFormSwitchField

export type AppFormData = Record<string, unknown>

export interface AppFormProps {
  onSubmit: (formData: AppFormData) => void
  fields: Record<string, AppFormField>
  submitBtnText: string
  submitBtnLoading?: boolean
  children?: React.ReactNode
}
