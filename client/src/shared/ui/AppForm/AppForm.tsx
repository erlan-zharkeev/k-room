import './style.scss'
import React, { useEffect, useState } from 'react'

import { useValidate, ValidateRule } from 'src/shared/lib'

import { AppButton } from '../AppButton/AppButton'
import { AppElementPicker } from '../AppElementPicker/AppElementPicker'
import { AppFileLoader } from '../AppFileLoader/AppFileLoader'
import { FileLoaderPayloadType } from '../AppFileLoader/types'
import { AppFormItem } from '../AppFormItem/AppFormItem'
import { AppInput } from '../AppInput/AppInput'
import { AppSwitch } from '../AppSwitch/AppSwitch'

import { AppFormField, AppFormFieldValue, AppFormProps } from './types'

export * from './types'

const getDefaultValue = (inputType: AppFormField['inputType']): AppFormFieldValue => {
  switch (inputType) {
    case 'switch':
      return false
    case 'file':
    case 'element-picker':
      return []
    default:
      return ''
  }
}

export const AppForm = ({
  onSubmit,
  fields,
  submitBtnText,
  actionProcessing,
  children,
  prefixSlot,
  onChange,
  title,
  disabled = false
}: AppFormProps) => {
  const initialState: Record<string, AppFormFieldValue> = {}
  Object.keys(fields).forEach((key) => {
    initialState[key] = fields[key].value ?? getDefaultValue(fields[key].inputType)
  })

  const [form, setForm] = useState(initialState)
  const { touchedFields, validateField, errors, isFormTotalValid } = useValidate(form)

  const handleChange = (
    inputOrPatch: React.ChangeEvent<HTMLInputElement> | { name: string; value: AppFormFieldValue },
    rule?: ValidateRule
  ) => {
    const name = 'target' in inputOrPatch ? inputOrPatch.target.name : inputOrPatch.name
    const value = 'target' in inputOrPatch ? inputOrPatch.target.value : inputOrPatch.value

    const newForm = { ...form, [name]: value }
    setForm(newForm)
    validateField(value, name, false, rule)

    if (onChange) onChange(newForm)
  }

  const validateAllFields = (silent = true) => {
    Object.entries(fields).forEach(([fieldName, field]) => {
      if (field.hide) return
      validateField(form[fieldName], fieldName, silent, field.rule)
    })
  }

  useEffect(() => {
    validateAllFields()
  }, [fields])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(form)
  }

  const renderField = (key: string, field: AppFormField) => {
    if (field.hide) return null

    const commonProps = {
      name: key,
      disabled: actionProcessing || disabled
    }

    switch (field.inputType) {
      case 'switch':
        return (
          <>
            <AppSwitch
              {...commonProps}
              value={form[key] as boolean}
              onChange={(e) => handleChange(e, field.rule)}
              onText={field.onText}
              offText={field.offText}
            />
            {field.children}
          </>
        )

      case 'text':
        return (
          <AppInput
            {...commonProps}
            value={form[key] as string}
            placeholder={field.placeholder}
            nativeType={field.nativeType}
            autoComplete={field.autoComplete}
            onChange={(e) => handleChange(e, field.rule)}
            onBlur={() => validateAllFields(true)}
            showClearButton={field.showClearButton}
            prefixSlot={field.prefixSlot}
          />
        )

      case 'file':
        return (
          <AppFileLoader
            {...commonProps}
            multiple={field.multiple}
            allowedResolutions={field.allowedResolutions}
            showPreview={field.showPreview}
            value={form[key] as FileLoaderPayloadType}
            onChange={(images) => handleChange({ name: key, value: images })}
            design={field.design}
            avatarStubIcon={field.avatarStubIcon}
            avatarShape={field.avatarShape}
            avatarBorderless={field.avatarBorderless}
          />
        )

      case 'element-picker':
        return (
          <AppElementPicker
            {...commonProps}
            fromTitle={field.fromTitle}
            toTitle={field.toTitle}
            availableElements={field.availableElements}
            value={form[key] as string[]}
            setPickedElementIds={(elements) => handleChange({ name: key, value: elements }, field.rule)}
          />
        )

      default:
        return null
    }
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {title && <div className="app-form__title header-text header-text--md header-text--accent">{title}</div>}
      <div className="app-form__prefix-slot">{prefixSlot}</div>

      {Object.keys(fields).map((key) => (
        <AppFormItem
          key={key}
          name={key}
          errors={errors[key] && touchedFields[key] ? errors[key] : []}
          label={fields[key].label}
        >
          {renderField(key, fields[key])}
        </AppFormItem>
      ))}

      {children}

      {submitBtnText && (
        <div className="app-form__controls">
          <AppButton
            htmltype="submit"
            text={submitBtnText}
            color="accent-color"
            loading={actionProcessing}
            disabled={disabled || !isFormTotalValid}
            fill
          />
        </div>
      )}
    </form>
  )
}
