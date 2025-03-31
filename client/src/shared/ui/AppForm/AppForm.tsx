import React, { useEffect, useState } from 'react'
import { AppFormFieldValue, AppFormProps } from './types'
import { AppButton } from '../AppButton/AppButton'
import { AppFormItem } from '../AppFormItem/AppFormItem'
import { AppInput } from '../AppInput/AppInput'
import { useValidate, ValidateRule } from 'src/shared/lib'
import { AppSwitch } from '../AppSwitch/AppSwitch'
export * from './types'

export const AppForm = ({
  onSubmit,
  fields,
  submitBtnText,
  submitBtnLoading,
  children,
  showSubmitBtn = true,
  onChange
}: AppFormProps) => {
  const [form, setForm] = useState(() => {
    const initialState: Record<string, AppFormFieldValue> = {}
    Object.keys(fields).forEach((key) => {
      initialState[key] = fields[key].value
    })
    return initialState
  })

  const { touchedFields, validateField, errors, isFormTotalValid } = useValidate(form)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rule?: ValidateRule) => {
    if (onChange) onChange(e)
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
    validateField(value, name, false, rule)
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
      {Object.keys(fields).map((key) => {
        const field = fields[key]
        return (
          <AppFormItem key={key} name={key} errors={errors[key] && touchedFields[key] ? errors[key] : []}>
            {field.inputType === 'switch' ? (
              <AppSwitch
                name={key}
                value={form[key] as boolean}
                onChange={(e) => handleChange(e, field.rule)}
                onText={field.onText}
                offText={field.offText}
              >
                {field.children}
              </AppSwitch>
            ) : (
              <AppInput
                name={key}
                value={form[key] as string}
                placeholder={field.placeholder}
                type={field.type}
                autoComplete={field.autoComplete}
                onChange={(e) => handleChange(e, field.rule)}
                onBlur={() => validateAllFields(false)}
                showClearButton={field.showClearButton}
                prefixSlot={field.prefixSlot}
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
            disabled={!isFormTotalValid}
          />
        </div>
      )}
    </form>
  )
}
