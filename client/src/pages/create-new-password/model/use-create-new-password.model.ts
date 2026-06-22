import type { INmorphFormDataExpose } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES, USER_ENDPOINTS, createValidationMessages, isString } from 'global-shared'
import type { CreateNewPasswordPayload } from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHttp } from 'src/shared/api'
import { createExactOrEmptyValidationPattern, createPasswordValidationRules, useI18n } from 'src/shared/lib'

import { DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA } from '../config/constants'
import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'

export const useCreateNewPassword = () => {
  const route = useRoute()
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const validationMessages = createValidationMessages(t)
  const { firstPassword, secondPassword } = clone(DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA)
  const formRef = useTemplateRef<INmorphFormDataExpose>('formRef')
  const passwordRules = createPasswordValidationRules(validationMessages)
  const formData = reactive({
    firstPassword: { value: firstPassword, rules: passwordRules },
    secondPassword: { value: secondPassword, rules: passwordRules }
  })
  const isLoading = ref(false)
  const isPasswordChanged = ref(false)
  const successMessage = ref('')
  const passwordRecoveryCode = computed(() => route.query['password-recovery'])
  const isFormValid = computed(() => formRef.value?.formData.isFormValid.value ?? false)
  const isSubmitDisabled = computed(() => isLoading.value || !isFormValid.value)

  const submit = async () => {
    if (!isFormValid.value || !isString(passwordRecoveryCode.value)) {
      return
    }

    isLoading.value = true

    try {
      const payload: CreateNewPasswordPayload = {
        password: formData.secondPassword.value,
        codeToValidate: passwordRecoveryCode.value
      }
      const response = await doHttpRequest<null>('post', USER_ENDPOINTS.resetPassword, payload, {
        showSuccessToast: false
      })

      successMessage.value = response.data.message.silent ? '' : response.data.message.text
      isPasswordChanged.value = true
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => formData.firstPassword.value,
    (firstPassword) => {
      formData.secondPassword.rules = [
        {
          pattern: createExactOrEmptyValidationPattern(firstPassword),
          error: t(CREATE_NEW_PASSWORD_I18N.mismatch)
        },
        ...passwordRules
      ]
    },
    { immediate: true }
  )

  const initializeCreateNewPassword = async () => {
    if (!isString(passwordRecoveryCode.value)) {
      await router.push(ROUTE_NAMES.app)
    }
  }

  return {
    formData,
    initializeCreateNewPassword,
    isFormValid,
    isLoading,
    isPasswordChanged,
    isSubmitDisabled,
    submit,
    successMessage
  }
}
