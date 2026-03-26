import type { ChangeEvent } from 'react'

import { UnknownCallback } from 'common'

import type { FileLoaderValueType } from 'src/shared/config'
import {
  ISwitchValidateRule,
  ITextInputValidateRule,
  IFileInputValidateRule,
  IElementPickerValidateRule
} from 'src/shared/lib'
import type { IAppElementPickerProps } from 'src/shared/ui/AppElementPicker/config'
import type { IAppFileLoaderProps } from 'src/shared/ui/AppFileLoader/config'
import type { IAppInputProps } from 'src/shared/ui/AppInput/config'
import type { IAppSwitchProps } from 'src/shared/ui/AppSwitch/config'

export type AppFormFieldValue = string | boolean | FileLoaderValueType | string[]

type BaseAppFormField<T extends string, V = AppFormFieldValue> = {
  inputType: T
  label?: string
  hide?: boolean
  rule?: unknown
  value?: V
} & { [key: string]: unknown }

export type AppFormSwitchField = BaseAppFormField<'switch', boolean> &
  Omit<IAppSwitchProps, 'name'> & {
    rule?: ISwitchValidateRule
    children?: React.ReactNode
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  }

export type AppFormTextInputField = BaseAppFormField<'text', string> &
  Omit<IAppInputProps, 'name'> & {
    rule?: ITextInputValidateRule
    onChange?: (event: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  }

export type AppFormFileInputField = BaseAppFormField<'file', FileLoaderValueType> &
  Omit<IAppFileLoaderProps, 'name' | 'onChange'> & {
    rule?: IFileInputValidateRule
    onChange?: (fieldData: { name: string; value: FileLoaderValueType }) => void
  }

export type AppFormPickElementField = BaseAppFormField<'element-picker'> &
  Omit<IAppElementPickerProps, 'name' | 'setPickedElementIds'> & {
    rule?: IElementPickerValidateRule
    onChange?: (fieldData: { name: string; value: string[] }) => void
  }

export type AppFormField = AppFormTextInputField | AppFormSwitchField | AppFormFileInputField | AppFormPickElementField

export type AppFormData = Record<string, AppFormFieldValue>

export interface IAppFormProps<TFormData extends object = AppFormData> {
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
  onBlur?: UnknownCallback;
}
