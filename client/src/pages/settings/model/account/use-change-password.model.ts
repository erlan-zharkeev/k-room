import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import { createValidationMessages, NON_EMPTY_PATTERN, USER_ENDPOINTS } from 'global-shared'
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'

import { isExpectedHttpError, useHttp } from 'src/shared/api'
import {
  createDifferentOrEmptyValidationPattern,
  createExactOrEmptyValidationPattern,
  createPasswordValidationRules,
  useI18n
} from 'src/shared/lib'

import { SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N } from '../../config/i18n/account-change-password.i18n'

export const useChangePassword = () => {
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const formRef = useTemplateRef<INmorphFormDataExpose>('formRef')
  const formResetKey = ref(0)
  const isPasswordChanging = ref(false)
  const passwordRules = createPasswordValidationRules(validationMessages)
  const repeatPasswordRules = [{ pattern: NON_EMPTY_PATTERN, error: validationMessages.passwordIsRequired }]

  const formData = reactive({
    currentPassword: {
      value: '',
      rules: [{ pattern: NON_EMPTY_PATTERN, error: validationMessages.passwordIsRequired }]
    },
    nextPassword: { value: '', rules: passwordRules },
    repeatPassword: { value: '', rules: repeatPasswordRules }
  })

  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)
  const isPasswordSubmitDisabled = computed(() => isPasswordChanging.value || !isFormValid.value)

  const updateNextPasswordRules = () => {
    const shouldCompareWithCurrentPassword = Boolean(formData.currentPassword.value && formData.nextPassword.value)

    if (!shouldCompareWithCurrentPassword && formData.nextPassword.rules === passwordRules) return

    formData.nextPassword.rules = shouldCompareWithCurrentPassword
      ? [
          ...passwordRules,
          {
            pattern: createDifferentOrEmptyValidationPattern(formData.currentPassword.value),
            error: t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.newPasswordSameAsCurrent)
          }
        ]
      : passwordRules
  }

  const updateRepeatPasswordRules = () => {
    const shouldCompareWithNextPassword = Boolean(formData.nextPassword.value && formData.repeatPassword.value)

    if (!shouldCompareWithNextPassword && formData.repeatPassword.rules === repeatPasswordRules) return

    formData.repeatPassword.rules = shouldCompareWithNextPassword
      ? [
          {
            pattern: createExactOrEmptyValidationPattern(formData.nextPassword.value),
            error: t(SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N.passwordMismatch)
          },
          ...repeatPasswordRules
        ]
      : repeatPasswordRules
  }

  const changePassword = async () => {
    if (isPasswordSubmitDisabled.value) return

    try {
      isPasswordChanging.value = true
      await doHttpRequest<null>('patch', USER_ENDPOINTS.changePassword, {
        currentPassword: formData.currentPassword.value,
        password: formData.nextPassword.value
      })
      formData.currentPassword.value = ''
      formData.nextPassword.value = ''
      formData.repeatPassword.value = ''
      formResetKey.value += 1
    } catch (error) {
      if (isExpectedHttpError(error)) return

      throw error
    } finally {
      isPasswordChanging.value = false
    }
  }

  watch([() => formData.currentPassword.value, () => formData.nextPassword.value], () => {
    updateNextPasswordRules()
    updateRepeatPasswordRules()
  })

  watch(
    () => formData.repeatPassword.value,
    () => {
      updateRepeatPasswordRules()
    }
  )

  return {
    changePassword,
    formData,
    formResetKey,
    isPasswordChanging,
    isPasswordSubmitDisabled
  }
}
