import './style.scss'
import React, { useEffect, useState } from 'react'

import { useValidate, ValidateRule } from 'src/shared/lib'

import { AppButton } from '../AppButton/AppButton'
import { AppFileLoader } from '../AppFileLoader/AppFileLoader'
import { FileLoaderPayloadType } from '../AppFileLoader/types'
import { AppFormItem } from '../AppFormItem/AppFormItem'
import { AppInput } from '../AppInput/AppInput'
import { AppSwitch } from '../AppSwitch/AppSwitch'

import { AppFormFieldValue, AppFormProps } from './types'
export * from './types'

export const AppForm = ({
  onSubmit,
  fields,
  submitBtnText,
  submitBtnLoading,
  children,
  showSubmitBtn = true,
  onChange,
  title,
  disabled = false
}: AppFormProps) => {
  const initialState: Record<string, AppFormFieldValue> = {}
  Object.keys(fields).forEach((key) => {
    initialState[key] = fields[key].value
  })

  const [form, setForm] = useState(initialState)

  const { touchedFields, validateField, errors, isFormTotalValid } = useValidate(form)

  const handleChange = (
    inputOrPatch: React.ChangeEvent<HTMLInputElement> | { name: string; value: AppFormFieldValue },
    rule?: ValidateRule
  ) => {
    const name = 'target' in inputOrPatch ? inputOrPatch.target.name : inputOrPatch.name
    const value = 'target' in inputOrPatch ? inputOrPatch.target.value : inputOrPatch.value

    const newForm = {
      ...form,
      [name]: value
    }

    setForm(newForm)
    validateField(value, name, false, rule)

    if (onChange) {
      onChange(newForm)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(form)
  }

  useEffect(() => {
    validateAllFields()
  }, [])

  const validateAllFields = (silent = true) => {
    Object.entries(fields).forEach(([fieldName, field]) => {
      validateField(form[fieldName], fieldName, silent, field.rule)
    })
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {title && <div className="app-form__title header-text header-text--md header-text--accent">{title}</div>}
      {Object.keys(fields).map((key) => {
        const field = fields[key]
        return (
          <AppFormItem key={key} name={key} errors={errors[key] && touchedFields[key] ? errors[key] : []}>
            {field.inputType === 'switch' && (
              <>
                <AppSwitch
                  name={key}
                  value={form[key] as boolean}
                  onChange={(e) => handleChange(e, field.rule)}
                  onText={field.onText}
                  offText={field.offText}
                  disabled={submitBtnLoading || disabled}
                />
                {field.children}
              </>
            )}
            {field.inputType === 'text' && (
              <AppInput
                name={key}
                value={form[key] as string}
                placeholder={field.placeholder}
                nativeType={field.nativeType}
                autoComplete={field.autoComplete}
                onChange={(e) => handleChange(e, field.rule)}
                onBlur={() => validateAllFields(true)}
                showClearButton={field.showClearButton}
                prefixSlot={field.prefixSlot}
                disabled={submitBtnLoading || disabled}
              />
            )}
            {field.inputType === 'file' && (
              <AppFileLoader
                name={key}
                multiple={field.multiple}
                allowedResolutions={field.allowedResolutions}
                showPreview={field.showPreview}
                value={form[key] as FileLoaderPayloadType}
                onChange={(images) => handleChange({ name: key, value: images })}
                design={field.design}
                disabled={submitBtnLoading || disabled}
              />
            )}
          </AppFormItem>
        )
      })}
      {children}
      {showSubmitBtn && (
        <div className="app-form__controls">
          <AppButton
            htmltype="submit"
            text={submitBtnText}
            color="accent-color"
            loading={submitBtnLoading}
            disabled={disabled || !isFormTotalValid}
          />
        </div>
      )}
    </form>
  )
}
