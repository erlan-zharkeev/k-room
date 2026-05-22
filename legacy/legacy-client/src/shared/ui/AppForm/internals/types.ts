import { ChangeEvent } from 'react'

import { UnknownCallback } from 'common'

import { FileLoaderValue } from 'src/shared/config'
import {
  SwitchValidateRule,
  TextInputValidateRule,
  FileInputValidateRule,
  ElementPickerValidateRule
} from 'src/shared/lib'
import { AppSwitchProps } from 'src/shared/ui/AppSwitch/internals/types'
import { AppInputProps } from 'src/shared/ui/AppInput/internals/types'
import { AppFileLoaderProps } from 'src/shared/ui/AppFileLoader/internals/types'
import { AppElementPickerProps } from 'src/shared/ui/AppElementPicker/internals/types'

export type AppFormFieldValue = string | boolean | FileLoaderValue | string[]

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
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  }

export type AppFormTextInputField = BaseAppFormField<'text', string> &
  Omit<AppInputProps, 'name'> & {
    rule?: TextInputValidateRule
    onChange?: (event: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  }

export type AppFormFileInputField = BaseAppFormField<'file', FileLoaderValue> &
  Omit<AppFileLoaderProps, 'name' | 'onChange'> & {
    rule?: FileInputValidateRule
    onChange?: (fieldData: { name: string; value: FileLoaderValue }) => void
  }

export type AppFormPickElementField = BaseAppFormField<'element-picker'> &
  Omit<AppElementPickerProps, 'name' | 'setPickedElementIds'> & {
    rule?: ElementPickerValidateRule
    onChange?: (fieldData: { name: string; value: string[] }) => void
  }

export type AppFormField = AppFormTextInputField | AppFormSwitchField | AppFormFileInputField | AppFormPickElementField

export type AppFormData = Record<string, AppFormFieldValue>

export interface AppFormProps<TFormData extends object = AppFormData> {
  title?: string
  disabled?: boolean
  onChange?: (formData: TFormData) => void
  onSubmit?: (formData: TFormData) => void
  fields: Record<string, AppFormField>
  submitBtnText?: string
  actionProcessing?: boolean
  prefixSlot?: React.ReactNode
  children?: React.ReactNode
  disabledActionBtn?: boolean
  onBlur?: UnknownCallback
}
