import { ROUTE_NAMES, USER_ENDPOINTS, type ICreateNewPasswordPayload } from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import { log, useFormValidation, useI18n, usePrimeVueFormResolver } from 'src/shared/lib'

import { DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA } from '../config/constants'
import { CREATE_NEW_PASSWORD_I18N } from '../config/i18n'
import { CREATE_NEW_PASSWORD_RULES } from '../config/rules'

export const useCreateNewPassword = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const { t } = useI18n()
  const formData = reactive(clone(DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA))
  const { getFirstErrorText, isFormValid, submitForm, touchField, visibleErrors } = useFormValidation(
    formData,
    CREATE_NEW_PASSWORD_RULES
  )
  const resolver = usePrimeVueFormResolver(CREATE_NEW_PASSWORD_RULES)
  const isLoading = ref(false)
  const isPasswordChanged = ref(false)
  const isFormTouched = ref(false)
  const passwordRecoveryCode = computed(() => route.query['password-recovery'])
  const passwordMismatchText = computed(() =>
    isFormTouched.value && formData.firstPassword !== formData.secondPassword
      ? t(CREATE_NEW_PASSWORD_I18N.mismatch)
      : ''
  )
  const isSubmitDisabled = computed(
    () => isLoading.value || !isFormValid.value || formData.firstPassword !== formData.secondPassword
  )
  const isFirstPasswordInvalid = computed(() => Boolean(visibleErrors.value.firstPassword?.length))
  const isSecondPasswordInvalid = computed(() =>
    Boolean(visibleErrors.value.secondPassword?.length || passwordMismatchText.value)
  )
  const firstPasswordErrorText = computed(() => getFirstErrorText('firstPassword'))
  const secondPasswordErrorText = computed(() => getFirstErrorText('secondPassword') || passwordMismatchText.value)

  const submit = () => {
    isFormTouched.value = true
    submitForm(async () => {
      if (formData.firstPassword !== formData.secondPassword || typeof passwordRecoveryCode.value !== 'string') return

      isLoading.value = true

      try {
        const payload: ICreateNewPasswordPayload = {
          password: formData.secondPassword,
          codeToValidate: passwordRecoveryCode.value
        }
        await doRequest<null>('post', USER_ENDPOINTS.resetPassword, payload)

        isPasswordChanged.value = true
      } catch (error) {
        log('error', 'Create new password failed', error)
      } finally {
        isLoading.value = false
      }
    })
  }

  const initializeCreateNewPassword = async () => {
    if (typeof passwordRecoveryCode.value !== 'string') {
      await router.push(ROUTE_NAMES.app)
    }
  }

  return {
    firstPasswordErrorText,
    formData,
    initializeCreateNewPassword,
    isFirstPasswordInvalid,
    isLoading,
    isPasswordChanged,
    isSecondPasswordInvalid,
    isSubmitDisabled,
    resolver,
    secondPasswordErrorText,
    submit,
    touchField
  }
}
