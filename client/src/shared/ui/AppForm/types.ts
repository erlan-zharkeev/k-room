import {
  SwitchValidateRule,
  TextInputValidateRule,
  FileInputValidateRule,
  ElementPickerValidateRule
} from 'src/shared/lib'

import { AppElementPickerProps } from '../AppElementPicker/types'
import { AppFileLoaderProps, FileLoaderPayloadType } from '../AppFileLoader/types'
import { AppInputProps } from '../AppInput/types'
import { AppSwitchProps } from '../AppSwitch/types'

export type AppFormFieldValue = string | boolean | FileLoaderPayloadType | string[]

type BaseAppFormField<T extends string, V = AppFormFieldValue> = {
  inputType: T
  label?: string
  hide?: boolean
  rule?: unknown
  value?: V
} & { [key: string]: unknown }

export type AppFormSwitchField = BaseAppFormField<'switch', boolean> &
  Omit<AppSwitchProps, 'name'> & {
    rule?: SwitchValidateRule
    children?: React.ReactNode
  }

export type AppFormTextInputField = BaseAppFormField<'text', string> &
  Omit<AppInputProps, 'name'> & {
    rule?: TextInputValidateRule
  }

export type AppFormFileInputField = BaseAppFormField<'file', FileLoaderPayloadType> &
  Omit<AppFileLoaderProps, 'name' | 'onChange'> & {
    rule?: FileInputValidateRule
  }

export type AppFormPickElementField = BaseAppFormField<'element-picker'> &
  Omit<AppElementPickerProps, 'name' | 'setPickedElementIds'> & {
    rule?: ElementPickerValidateRule
  }

export type AppFormField = AppFormTextInputField | AppFormSwitchField | AppFormFileInputField | AppFormPickElementField

export type AppFormData = Record<string, unknown>

export interface AppFormProps {
  title?: string
  disabled?: boolean
  onChange?: (formData: AppFormData) => void
  onSubmit?: (formData: AppFormData) => void
  fields: Record<string, AppFormField>
  submitBtnText: string
  actionProcessing?: boolean
  prefixSlot?: React.ReactNode
  children?: React.ReactNode
}
