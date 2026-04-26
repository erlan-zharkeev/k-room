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
  const isUsernameInvalid = computed(() => Boolean(visibleErrors.value.username?.length))
  const isEmailInvalid = computed(() => Boolean(visibleErrors.value.email?.length))
  const isPasswordInvalid = computed(() => Boolean(visibleErrors.value.password?.length))
  const isPolicyInvalid = computed(() => Boolean(visibleErrors.value.policy?.length))
  const usernameErrorText = computed(() => getFirstErrorText('username'))
  const emailErrorText = computed(() => getFirstErrorText('email'))
  const passwordErrorText = computed(() => getFirstErrorText('password'))
  const policyErrorText = computed(() => getFirstErrorText('policy'))
  const submit = () => {
    submitForm(() => props.onRegister(formData))
  }

  return {
    emailErrorText,
    formData,
    isEmailInvalid,
    isPasswordInvalid,
    isPolicyInvalid,
    isSubmitDisabled,
    isUsernameInvalid,
    passwordErrorText,
    policyErrorText,
    resolver,
    submit,
    touchField,
    usernameErrorText
  }
}
