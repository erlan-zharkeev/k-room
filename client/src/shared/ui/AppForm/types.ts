
import { UnknownCallback } from 'common-types'

import { FileLoaderValueType } from 'src/shared/config'
import {
  ISwitchValidateRule,
  ITextInputValidateRule,
  IFileInputValidateRule,
  IElementPickerValidateRule
} from 'src/shared/lib'

import type { IAppElementPickerProps } from '../AppElementPicker/types'
import type { IAppFileLoaderProps } from '../AppFileLoader/types'
import type { IAppInputProps } from '../AppInput/types'
import type { IAppSwitchProps } from '../AppSwitch/types'

export type AppFormFieldValue = string | boolean | FileLoaderValueType | string[]

type BaseAppFormField<T extends string, V = AppFormFieldValue> = {
  inputType: T
  label?: string
  hide?: boolean
  rule?: unknown
  value?: V,
  onChange?: UnknownCallback
} & { [key: string]: unknown }

export type AppFormSwitchField = BaseAppFormField<'switch', boolean> &
  Omit<IAppSwitchProps, 'name'> & {
    rule?: ISwitchValidateRule
    children?: React.ReactNode
  }

export type AppFormTextInputField = BaseAppFormField<'text', string> &
  Omit<IAppInputProps, 'name'> & {
    rule?: ITextInputValidateRule
  }

export type AppFormFileInputField = BaseAppFormField<'file', FileLoaderValueType> &
  Omit<IAppFileLoaderProps, 'name' | 'onChange'> & {
    rule?: IFileInputValidateRule
  }

export type AppFormPickElementField = BaseAppFormField<'element-picker'> &
  Omit<IAppElementPickerProps, 'name' | 'setPickedElementIds'> & {
    rule?: IElementPickerValidateRule
  }

export type AppFormField = AppFormTextInputField | AppFormSwitchField | AppFormFileInputField | AppFormPickElementField

export type AppFormData = Record<string, unknown>

export interface IAppFormProps {
  title?: string
  disabled?: boolean
  onChange?: (formData: AppFormData) => void
  onSubmit?: (formData: AppFormData) => void
  fields: Record<string, AppFormField>
  submitBtnText?: string
  actionProcessing?: boolean
  prefixSlot?: React.ReactNode
  children?: React.ReactNode
  disabledActionBtn?: boolean
  onBlur?: UnknownCallback;
}
