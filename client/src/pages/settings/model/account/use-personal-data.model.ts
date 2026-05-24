import type { INmorphCustomFileData as NmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import {
  type GetUserDataResponse,
  USER_ENDPOINTS,
  createUpdateUserDataSchema,
  createValidationMessages,
  isNicknameValid,
  normalizeNickname
} from 'global-shared'
import { safeParse } from 'valibot'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { useHttp } from 'src/shared/api'
import { revokeObjectUrl, revokeObjectUrls, useAppToast, useI18n } from 'src/shared/lib'

import { SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE } from '../../config/constants/account.constants'
import { SETTINGS_ACCOUNT_PERSONAL_DATA_I18N } from '../../config/i18n/account-personal-data.i18n'

export const usePersonalData = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const { user, avatarId, update: updateUserData, displayedNickname } = useUser()
  const { doHttpRequest } = useHttp()
  const { t } = useI18n()
  const toast = useAppToast()
  const formData = reactive({
    avatar: { value: '', rules: [] },
    nickname: { value: '', rules: [] }
  })
  const accountAvatarFile = ref<File>()
  const accountAvatarUploadValue = ref<NmorphCustomFileData[]>([])
  const accountAvatarPreviewUrl = ref('')
  const accountAvatarWasReset = ref(false)
  const isAccountSaving = ref(false)
  const accountNicknameSchema = createUpdateUserDataSchema(createValidationMessages(t))

  let accountAvatarPreviewObjectUrl: string | undefined

  const displayedAvatarId = computed(() =>
    accountAvatarPreviewUrl.value || accountAvatarWasReset.value ? undefined : avatarId.value || undefined
  )
  const displayedUserId = computed(() => (user.value.id ? `#${user.value.id}` : ''))
  const normalizedAccountNickname = computed(() => normalizeNickname(formData.nickname.value))
  const isAccountNicknameEmpty = computed(() => !normalizedAccountNickname.value)
  const accountNicknameChanged = computed(
    () => normalizedAccountNickname.value !== normalizeNickname(user.value.nickname)
  )
  const accountAvatarChanged = computed(() => Boolean(accountAvatarFile.value || accountAvatarWasReset.value))
  const hasAccountChanges = computed(() => accountNicknameChanged.value || accountAvatarChanged.value)
  const accountNicknameError = computed(() => {
    if (!formData.nickname.value) return ''

    const result = safeParse(accountNicknameSchema, { nickname: formData.nickname.value }, { abortPipeEarly: true })

    return result.success ? '' : result.issues[0]?.message || ''
  })
  const isAccountSaveDisabled = computed(
    () =>
      !user.value.id || !hasAccountChanges.value || isAccountNicknameEmpty.value || Boolean(accountNicknameError.value)
  )

  const clearAccountAvatarPreview = () => {
    if (!accountAvatarPreviewObjectUrl) return

    revokeObjectUrl(accountAvatarPreviewObjectUrl)
    accountAvatarPreviewObjectUrl = undefined
    accountAvatarPreviewUrl.value = ''
  }

  const clearAccountAvatarUploadValue = () => {
    revokeObjectUrls(accountAvatarUploadValue.value.map(({ previewUrl }) => previewUrl))
    accountAvatarUploadValue.value = []
  }

  const uploadAccountAvatar = (files: NmorphCustomFileData[]) => {
    const uploadedFile = files[files.length - 1]
    const file = uploadedFile?.data

    if (!file) {
      clearAccountAvatarUploadValue()
      accountAvatarFile.value = undefined
      accountAvatarWasReset.value = false
      clearAccountAvatarPreview()

      return
    }

    if (file.size > SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE) {
      revokeObjectUrl(uploadedFile.previewUrl)
      clearAccountAvatarUploadValue()

      return
    }

    accountAvatarUploadValue.value
      .filter(({ previewUrl }) => previewUrl !== uploadedFile.previewUrl)
      .forEach(({ previewUrl }) => revokeObjectUrl(previewUrl))
    accountAvatarUploadValue.value = [uploadedFile]
    clearAccountAvatarPreview()
    accountAvatarFile.value = file
    accountAvatarWasReset.value = false
    accountAvatarPreviewObjectUrl = URL.createObjectURL(file)
    accountAvatarPreviewUrl.value = accountAvatarPreviewObjectUrl
  }

  const resetAccountAvatar = () => {
    clearAccountAvatarUploadValue()
    accountAvatarFile.value = undefined
    accountAvatarWasReset.value = true
    clearAccountAvatarPreview()
  }

  const copyUserId = async () => {
    if (!displayedUserId.value) return

    try {
      await navigator.clipboard.writeText(displayedUserId.value)
      toast.add({ content: t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.userIdCopied) })
    } catch (error) {
      void error
    }
  }

  const copyUserNickname = async () => {
    if (!displayedNickname.value) return

    try {
      await navigator.clipboard.writeText(displayedNickname.value)
      toast.add({ content: t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.nicknameCopied) })
    } catch (error) {
      void error
    }
  }

  const updateAccountData = async () => {
    const nickname = normalizedAccountNickname.value
    const currentAvatarId = avatarId.value

    if (isAccountSaveDisabled.value || !isNicknameValid(nickname)) return

    const requestFormData = new FormData()

    requestFormData.append('nickname', nickname)
    requestFormData.append('reset-avatar', accountAvatarWasReset.value ? 'reset' : '')

    if (accountAvatarFile.value) {
      requestFormData.append('file', accountAvatarFile.value)
    }

    try {
      isAccountSaving.value = true
      const response = await doHttpRequest<GetUserDataResponse>('patch', USER_ENDPOINTS.editUserData, requestFormData, {
        contentType: 'multipart/form-data'
      })
      const updatedUserData = response.data.payload
      const { avatarId } = updatedUserData

      await updateUserData(updatedUserData)

      if (currentAvatarId && currentAvatarId !== avatarId) {
        await removeMedia(currentAvatarId)
      }

      if (avatarId && accountAvatarFile.value) {
        await putMedia({
          id: avatarId,
          blob: accountAvatarFile.value,
          contentType: accountAvatarFile.value.type,
          etag: `${Date.now()}`,
          kind: 'image',
          lastModified: new Date().toUTCString(),
          lastChecked: Date.now()
        })
      }

      accountAvatarFile.value = undefined
      accountAvatarWasReset.value = false
      clearAccountAvatarUploadValue()
      clearAccountAvatarPreview()
    } finally {
      isAccountSaving.value = false
    }
  }

  watch(
    () => user.value.nickname,
    (nickname) => {
      formData.nickname.value = nickname
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    clearAccountAvatarUploadValue()
    clearAccountAvatarPreview()
  })

  return {
    user,
    formData,
    accountAvatarUploadValue,
    accountAvatarPreviewUrl,
    displayedAvatarId,
    displayedNickname,
    displayedUserId,
    accountNicknameError,
    isAccountSaveDisabled,
    isAccountSaving,
    copyUserId,
    copyUserNickname,
    resetAccountAvatar,
    updateAccountData,
    uploadAccountAvatar
  }
}
