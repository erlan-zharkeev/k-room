import clone from 'lodash/clone'
import { computed, reactive } from 'vue'

import { useFormValidation, usePrimeVueFormResolver } from 'src/shared/lib'

import { DEFAULT_REGISTRATION_FORM_DATA } from '../config/constants'
import { REGISTRATION_FORM_RULES } from '../config/rules'

import type { IRegistrationFormProps } from './types'

export const useRegistrationForm = (props: IRegistrationFormProps) => {
  const formData = reactive(clone(DEFAULT_REGISTRATION_FORM_DATA))
  const { getFirstErrorText, isFormValid, submitForm, touchField, visibleErrors } = useFormValidation(
    formData,
    REGISTRATION_FORM_RULES
  )
  const resolver = usePrimeVueFormResolver(REGISTRATION_FORM_RULES)
  const isSubmitDisabled = computed(() => props.isLoading || !isFormValid.value)
  const submit = () => {
    submitForm(() => props.onRegister(formData))
  }

  return {
    formData,
    getFirstErrorText,
    isSubmitDisabled,
    resolver,
    submit,
    touchField,
    visibleErrors
  }
}
