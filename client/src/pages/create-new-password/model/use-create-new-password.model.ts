import type { INmorphFromDataExpose } from '@nmorph/nmorph-ui-kit'
import { NON_EMPTY_PATTERN, ROUTE_NAMES, USER_ENDPOINTS, createValidationMessages } from 'global-shared'
import type { ICreateNewPasswordPayload } from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHttp } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import {
  DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA,
  PASSWORD_MIN_LENGTH_PATTERN,
  PASSWORD_NO_SPACES_PATTERN,
  PASSWORD_ONLY_LATIN_PATTERN,
  PASSWORD_STRONG_PATTERN
} from '../config/constants'
import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'

export const useCreateNewPassword = () => {
  const route = useRoute()
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const { firstPassword, secondPassword } = clone(DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA)
  const formRef = shallowRef<INmorphFromDataExpose | null>(null)
  const passwordRules = [
    { pattern: NON_EMPTY_PATTERN, error: validationMessages.passwordIsRequired },
    { pattern: PASSWORD_MIN_LENGTH_PATTERN, error: validationMessages.passwordMustBeAtLeast },
    { pattern: PASSWORD_STRONG_PATTERN, error: validationMessages.passwordMustBeStrong },
    { pattern: PASSWORD_NO_SPACES_PATTERN, error: validationMessages.passwordNotContainSpaces },
    { pattern: PASSWORD_ONLY_LATIN_PATTERN, error: validationMessages.passwordMustContainOnlyLatin }
  ]
  const formData = reactive({
    firstPassword: { value: firstPassword, rules: passwordRules },
    secondPassword: { value: secondPassword, rules: passwordRules }
  })
  const isLoading = ref(false)
  const isPasswordChanged = ref(false)
  const passwordRecoveryCode = computed(() => route.query['password-recovery'])
  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)
  const passwordMismatch = computed(() => formData.firstPassword.value !== formData.secondPassword.value)
  const passwordMismatchText = computed(() =>
    formData.secondPassword.value && passwordMismatch.value ? t(CREATE_NEW_PASSWORD_I18N.mismatch) : ''
  )

  const submit = async () => {
    if (!isFormValid.value || passwordMismatch.value || typeof passwordRecoveryCode.value !== 'string') {
      return
    }

    isLoading.value = true

    try {
      const payload: ICreateNewPasswordPayload = {
        password: formData.secondPassword.value,
        codeToValidate: passwordRecoveryCode.value
      }
      await doHttpRequest<null>('post', USER_ENDPOINTS.resetPassword, payload)

      isPasswordChanged.value = true
    } finally {
      isLoading.value = false
    }
  }

  const initializeCreateNewPassword = async () => {
    if (typeof passwordRecoveryCode.value !== 'string') {
      await router.push(ROUTE_NAMES.app)
    }
  }

  return {
    formData,
    formRef,
    initializeCreateNewPassword,
    isFormValid,
    isLoading,
    isPasswordChanged,
    passwordMismatch,
    passwordMismatchText,
    submit
  }
}
