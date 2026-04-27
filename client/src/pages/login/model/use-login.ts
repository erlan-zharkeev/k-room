import type { FormProps, FormSubmitEvent } from '@primevue/forms/form'
import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import { AUTH_ENDPOINTS, type IAuthLoginPayload, type ILoginResponse } from 'global-shared'
import { createAuthLoginSchema, createValidationMessages } from 'global-shared'
import clone from 'lodash/clone'
import { reactive, ref } from 'vue'

import { useUserSession } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { DEFAULT_LOGIN_FORM_DATA } from '../config/constants'

export const useLogin = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useUserSession()
  const { t } = useI18n()
  const isLoading = ref(false)
  const formData = reactive(clone(DEFAULT_LOGIN_FORM_DATA))
  const resolver: FormProps['resolver'] = valibotResolver(createAuthLoginSchema(createValidationMessages(t)))

  const login = async (payload: IAuthLoginPayload) => {
    isLoading.value = true

    try {
      const response = await doRequest<ILoginResponse>('post', AUTH_ENDPOINTS.login, payload)
      const { payload: user } = response.data

      await activateUserSession(user)
    } finally {
      isLoading.value = false
    }
  }

  const submit = ({ valid }: FormSubmitEvent) => {
    if (!valid) return

    login(formData)
  }

  return {
    formData,
    isLoading,
    login,
    resolver,
    submit
  }
}
