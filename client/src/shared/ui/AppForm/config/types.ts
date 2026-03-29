import type { ChangeEvent } from 'react'

import type { UnknownCallbackType } from 'common'

import type { FileLoaderValueType } from 'src/shared/config'
import {
  ISwitchValidateRule,
  ITextInputValidateRule,
  IFileInputValidateRule,
  IElementPickerValidateRule
} from 'src/shared/lib'

import type { IAppElementPickerProps } from '../../AppElementPicker/config'
import type { IAppFileLoaderProps } from '../../AppFileLoader/config'
import type { IAppInputProps } from '../../AppInput/config'
import type { IAppSwitchProps } from '../../AppSwitch/config'

export type AppFormFieldValueType = string | boolean | FileLoaderValueType | string[]

type BaseAppFormFieldType<T extends string, V = AppFormFieldValueType> = {
  inputType: T
  label?: string
  hide?: boolean
  rule?: unknown
  value?: V
} & { [key: string]: unknown }

export type AppFormSwitchFieldType = BaseAppFormFieldType<'switch', boolean> &
  Omit<IAppSwitchProps, 'name'> & {
    rule?: ISwitchValidateRule
    children?: React.ReactNode
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  }

export type AppFormTextInputFieldType = BaseAppFormFieldType<'text', string> &
  Omit<IAppInputProps, 'name'> & {
    rule?: ITextInputValidateRule
    onChange?: (event: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  }

export type AppFormFileInputFieldType = BaseAppFormFieldType<'file', FileLoaderValueType> &
  Omit<IAppFileLoaderProps, 'name' | 'onChange'> & {
    rule?: IFileInputValidateRule
    onChange?: (fieldData: { name: string; value: FileLoaderValueType }) => void
  }

export type AppFormPickElementFieldType = BaseAppFormFieldType<'element-picker'> &
  Omit<IAppElementPickerProps, 'name' | 'setPickedElementIds'> & {
    rule?: IElementPickerValidateRule
    onChange?: (fieldData: { name: string; value: string[] }) => void
  }

export type AppFormFieldType = AppFormTextInputFieldType | AppFormSwitchFieldType | AppFormFileInputFieldType | AppFormPickElementFieldType

export type AppFormDataType = Record<string, AppFormFieldValueType>

export interface IAppFormProps<TFormData extends object = AppFormDataType> {
  title?: string
  disabled?: boolean
  onChange?: (formData: TFormData) => void
  onSubmit?: (formData: TFormData) => void
  fields: Record<string, AppFormFieldType>
  submitBtnText?: string
  actionProcessing?: boolean
  prefixSlot?: React.ReactNode
  children?: React.ReactNode
  disabledActionBtn?: boolean
  onBlur?: UnknownCallbackType;
}
