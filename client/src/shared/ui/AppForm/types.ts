import { SwitchValidateRule, TextInputValidateRule, FileInputValidateRule } from 'src/shared/lib'

import { AppFileLoaderProps } from '../AppFileLoader/AppFileLoader'
import { FileLoaderPayloadType } from '../AppFileLoader/types'
import { AppInputProps } from '../AppInput/AppInput'
import { AppSwitchProps } from '../AppSwitch/AppSwitch'

export type AppFormFieldValue = string | boolean | FileLoaderPayloadType

export type AppFormSwitchField = {
  inputType: 'switch'
  rule?: SwitchValidateRule
  children?: React.ReactNode
} & Omit<AppSwitchProps, 'name'>

export type AppFormTextInputField = {
  inputType: 'text'
  rule?: TextInputValidateRule
} & Omit<AppInputProps, 'name'>

export type AppFormFileInputField = {
  inputType: 'file'
  rule?: FileInputValidateRule
} & Omit<AppFileLoaderProps, 'name'>

export type AppFormField = AppFormTextInputField | AppFormSwitchField | AppFormFileInputField

export type AppFormData = Record<string, unknown>

export interface AppFormProps {
  title?: string
  disabled?: boolean
  onChange?: (formData: AppFormData) => void
  showSubmitBtn?: boolean
  onSubmit?: (formData: AppFormData) => void
  fields: Record<string, AppFormField>
  submitBtnText: string
  submitBtnLoading?: boolean
  children?: React.ReactNode
}
