import type { FormProps, FormSubmitEvent } from '@primevue/forms/form'
import { valibotResolver } from '@primevue/forms/resolvers/valibot'
import {
  AUTH_ENDPOINTS,
  ROUTE_NAMES,
  createAuthRegistrationFormSchema,
  createValidationMessages,
  type IAuthRegistrationPayload,
  type ISendConfirmationLinkResponse
} from 'global-shared'
import clone from 'lodash/clone'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import { buildPathWithParams, useI18n } from 'src/shared/lib'

import { DEFAULT_REGISTRATION_FORM_DATA } from '../config/constants'

import type { RegistrationFormDataType } from './types'

export const useRegistration = () => {
  const router = useRouter()
  const { doRequest } = useApi()
  const { t } = useI18n()
  const isLoading = ref(false)
  const formData = reactive(clone(DEFAULT_REGISTRATION_FORM_DATA))
  const resolver: FormProps['resolver'] = valibotResolver(createAuthRegistrationFormSchema(createValidationMessages(t)))

  const register = async (payload: IAuthRegistrationPayload) => {
    isLoading.value = true

    try {
      const response = await doRequest<ISendConfirmationLinkResponse>('post', AUTH_ENDPOINTS.registration, payload)
      const pathname = buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, response.data.payload)

      await router.push(pathname)
    } finally {
      isLoading.value = false
    }
  }

  const submitRegistration = ({ email, password, nickname }: RegistrationFormDataType) => {
    register({ email, password, nickname })
  }

  const submit = ({ valid }: FormSubmitEvent) => {
    if (!valid) return

    submitRegistration(formData)
  }

  return {
    formData,
    isLoading,
    register,
    resolver,
    submit
  }
}
