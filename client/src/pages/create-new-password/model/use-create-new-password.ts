import type { FormProps, FormSubmitEvent } from '@primevue/forms/form'
import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import { ROUTE_NAMES, USER_ENDPOINTS, type ICreateNewPasswordPayload } from 'global-shared'
import { createCreateNewPasswordFormSchema, createValidationMessages } from 'global-shared'
import clone from 'lodash/clone'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA } from '../config/constants'

export const useCreateNewPassword = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const { t } = useI18n()
  const formData = reactive(clone(DEFAULT_CREATE_NEW_PASSWORD_FORM_DATA))
  const resolver: FormProps['resolver'] = valibotResolver(
    createCreateNewPasswordFormSchema(createValidationMessages(t))
  )
  const isLoading = ref(false)
  const isPasswordChanged = ref(false)
  const isFormTouched = ref(false)
  const passwordRecoveryCode = computed(() => route.query['password-recovery'])

  const submit = async ({ valid }: FormSubmitEvent) => {
    isFormTouched.value = true

    const { firstPassword, secondPassword } = formData

    if (!valid || firstPassword !== secondPassword || typeof passwordRecoveryCode.value !== 'string') {
      return
    }

    isLoading.value = true

    try {
      const payload: ICreateNewPasswordPayload = {
        password: secondPassword,
        codeToValidate: passwordRecoveryCode.value
      }
      await doRequest<null>('post', USER_ENDPOINTS.resetPassword, payload)

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
    initializeCreateNewPassword,
    isFormTouched,
    isLoading,
    isPasswordChanged,
    resolver,
    submit
  }
}
