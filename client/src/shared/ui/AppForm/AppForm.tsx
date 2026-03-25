import './style.scss'
import React, { useEffect, useState } from 'react'

import { FileLoaderValueType } from 'src/shared/config'
import { useValidate, ValidateRule } from 'src/shared/lib'

import { AppButton } from '../AppButton/AppButton'
import { AppElementPicker } from '../AppElementPicker/AppElementPicker'
import { AppFileLoader } from '../AppFileLoader/AppFileLoader'
import { AppFormItem } from '../AppFormItem/AppFormItem'
import { AppHeader } from '../AppHeader/AppHeader'
import { AppInput } from '../AppInput/AppInput'
import { AppSwitch } from '../AppSwitch/AppSwitch'

import type { AppFormData, AppFormField, AppFormFieldValue, IAppFormProps } from './config'

export * from './config'

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

export const AppForm = <TFormData extends object = AppFormData>({
  onSubmit,
  fields,
  submitBtnText,
  actionProcessing,
  children,
  prefixSlot,
  onChange,
  title,
  onBlur = () => {},
  disabled = false,
  disabledActionBtn = false
}: IAppFormProps<TFormData>) => {
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

    // console.log()

    const newForm = { ...form, [name]: value }
    setForm(newForm)
    validateField(value, name, false, rule)

    if (onChange) onChange(newForm as TFormData)
  }

  const validateAllFields = (silent = true) => {
    Object.entries(fields).forEach(([fieldName, field]) => {
      if (field.hide) return
      validateField(form[fieldName], fieldName, silent, field.rule)
    })
  }

  useEffect(() => {
    validateAllFields()
    const next: Record<string, AppFormFieldValue> = {}
    for (const [k, f] of Object.entries(fields)) {
      next[k] = f.value ?? getDefaultValue(f.inputType)
    }

    let changed = false
    for (const k of Object.keys(next)) {
      if (form[k] !== next[k]) {
        changed = true
        break
      }
    }
    if (changed) setForm(next)
  }, [fields])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(form as TFormData)
  }

  const renderField = (key: string, field: AppFormField) => {
    const commonProps = {
      name: key,
      disabled: actionProcessing ?? disabled
    }

    switch (field.inputType) {
      case 'switch':
        return (
          <>
            <AppSwitch
              {...commonProps}
              value={form[key] as boolean}
              onChange={(e) => {
                if (field.onChange) field.onChange(e)
                handleChange(e, field.rule)
              }}
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
            onChange={(e) => {
              if (field.onChange) field.onChange(e)
              handleChange(e, field.rule)
            }}
            onBlur={() => {
              onBlur()
              validateAllFields(true)
            }}
            showClearButton={field.showClearButton}
            prefixSlot={field.prefixSlot}
            ref={field.ref}
          />
        )

      case 'file':
        return (
          <AppFileLoader
            {...commonProps}
            multiple={field.multiple}
            allowedResolutions={field.allowedResolutions}
            showPreview={field.showPreview}
            value={form[key] as FileLoaderValueType}
            onChange={(images) => {
              if (field.onChange) field.onChange({ name: key, value: images })
              handleChange({ name: key, value: images })
            }}
            design={field.design}
            avatarStubIcon={field.avatarStubIcon}
            avatarShape={field.avatarShape}
            avatarBorderless={field.avatarBorderless}
            showTextLabel={field.showTextLabel}
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
            setPickedElementIds={(elements) => {
              if (field.onChange) field.onChange({ name: key, value: elements })
              handleChange({ name: key, value: elements }, field.rule)
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {title && (
        <AppHeader tag="h3" accent additionalClassName="app-form__title">
          {title}
        </AppHeader>
      )}
      {prefixSlot && <div className="app-form__prefix-slot">{prefixSlot}</div>}
      {Object.entries(fields).map(([name, field]) =>
        !field.hide ? (
          <AppFormItem
            key={name}
            name={name}
            errors={errors[name] && touchedFields[name] ? errors[name] : []}
            label={field.label}
          >
            {renderField(name, field)}
          </AppFormItem>
        ) : null
      )}
      {children}
      {submitBtnText && (
        <div className="app-form__controls">
          <AppButton
            htmltype="submit"
            text={submitBtnText}
            color="accent-color"
            loading={actionProcessing}
            disabled={disabled || !isFormTotalValid || disabledActionBtn}
            fill
          />
        </div>
      )}
    </form>
  )
}
