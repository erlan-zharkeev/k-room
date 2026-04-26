import clone from 'lodash/clone'
import { computed, reactive } from 'vue'

import { useFormValidation, usePrimeVueFormResolver } from 'src/shared/lib'

import { DEFAULT_LOGIN_FORM_DATA } from '../config/constants'
import { LOGIN_FORM_RULES } from '../config/rules'

import type { ILoginFormProps } from './types'

export const useLoginForm = (props: ILoginFormProps) => {
  const formData = reactive(clone(DEFAULT_LOGIN_FORM_DATA))
  const { getFirstErrorText, isFormValid, submitForm, touchField, visibleErrors } = useFormValidation(
    formData,
    LOGIN_FORM_RULES
  )
  const resolver = usePrimeVueFormResolver(LOGIN_FORM_RULES)
  const isFormDisabled = computed(() => props.isLoading || props.isFirebaseLoginLoading)
  const isSubmitDisabled = computed(() => isFormDisabled.value || !isFormValid.value)
  const submit = () => {
    submitForm(() => props.onLogin(formData))
  }

  return {
    formData,
    getFirstErrorText,
    isFormDisabled,
    isSubmitDisabled,
    resolver,
    submit,
    touchField,
    visibleErrors
  }
}
