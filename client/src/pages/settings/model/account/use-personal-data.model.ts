import type { INmorphCustomFileData as NmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { useClipboard } from '@vueuse/core'
import {
  NICKNAME_MAX_LENGTH_PATTERN,
  NICKNAME_MIN_LENGTH_PATTERN,
  NICKNAME_PATTERN,
  NON_EMPTY_PATTERN,
  USER_ENDPOINTS,
  createValidationMessages,
  isNicknameValid,
  type UserData
} from 'global-shared'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { isExpectedHttpError, useHttp } from 'src/shared/api'
import {
  captureClientSentryException,
  revokeObjectUrl,
  revokeObjectUrls,
  useAppToast,
  useI18n,
  withClientSentryScope
} from 'src/shared/lib'

import { SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE } from '../../config/constants/account.constants'
import { SETTINGS_ACCOUNT_PERSONAL_DATA_I18N } from '../../config/i18n/account-personal-data.i18n'
import { buildAccountAvatarFileDiagnostics, normalizeAccountAvatarFile } from '../../lib/account-avatar-file'

export const usePersonalData = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const { user, avatarId, update: updateUserData } = useUser()
  const { doHttpRequest } = useHttp()
  const { copy, isSupported: isClipboardSupported } = useClipboard()
  const { t } = useI18n()
  const toast = useAppToast()
  const validationMessages = createValidationMessages(t)
  const formData = reactive({
    avatar: { value: '', rules: [] },
    nickname: {
      value: '',
      rules: [
        { pattern: NICKNAME_PATTERN, error: validationMessages.nicknameInvalidFormat },
        { pattern: NICKNAME_MIN_LENGTH_PATTERN, error: validationMessages.nicknameTooShort },
        { pattern: NICKNAME_MAX_LENGTH_PATTERN, error: validationMessages.nicknameTooLong },
        { pattern: NON_EMPTY_PATTERN, error: validationMessages.fieldIsRequired }
      ]
    }
  })
  const accountAvatarFile = ref<File>()
  const accountAvatarUploadDiagnostics = ref<Record<string, unknown> | null>(null)
  const accountAvatarUploadValue = ref<NmorphCustomFileData[]>([])
  const accountAvatarPreviewUrl = ref('')
  const accountAvatarWasReset = ref(false)
  const isAccountSaving = ref(false)

  let accountAvatarPreviewObjectUrl: string | undefined

  const displayedAvatarId = computed(() =>
    accountAvatarPreviewUrl.value || accountAvatarWasReset.value ? undefined : avatarId.value || undefined
  )
  const displayedUserId = computed(() => (user.value.id ? `#${user.value.id}` : ''))
  const isAccountNicknameEmpty = computed(() => !formData.nickname.value)
  const accountNicknameChanged = computed(() => formData.nickname.value !== user.value.nickname)
  const accountAvatarChanged = computed(() => Boolean(accountAvatarFile.value || accountAvatarWasReset.value))
  const hasAccountChanges = computed(() => accountNicknameChanged.value || accountAvatarChanged.value)
  const isAccountSaveDisabled = computed(
    () =>
      !user.value.id ||
      !hasAccountChanges.value ||
      isAccountNicknameEmpty.value ||
      !isNicknameValid(formData.nickname.value)
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

  const uploadAccountAvatar = async (files: NmorphCustomFileData[]) => {
    const uploadedFile = files[files.length - 1]
    const file = uploadedFile?.data

    if (!file) {
      clearAccountAvatarUploadValue()
      accountAvatarFile.value = undefined
      accountAvatarUploadDiagnostics.value = null
      accountAvatarWasReset.value = false
      clearAccountAvatarPreview()

      return
    }

    const normalizedFile = await normalizeAccountAvatarFile(file)

    if (normalizedFile.size > SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE) {
      revokeObjectUrl(uploadedFile.previewUrl)
      clearAccountAvatarUploadValue()
      accountAvatarUploadDiagnostics.value = null

      return
    }

    accountAvatarUploadDiagnostics.value = {
      normalized: normalizedFile !== file,
      originalFile: buildAccountAvatarFileDiagnostics(file),
      uploadFile: buildAccountAvatarFileDiagnostics(normalizedFile)
    }
    accountAvatarUploadValue.value
      .filter(({ previewUrl }) => previewUrl !== uploadedFile.previewUrl)
      .forEach(({ previewUrl }) => revokeObjectUrl(previewUrl))
    accountAvatarUploadValue.value = [
      {
        ...uploadedFile,
        data: normalizedFile
      }
    ]
    clearAccountAvatarPreview()
    accountAvatarFile.value = normalizedFile
    accountAvatarWasReset.value = false
    accountAvatarPreviewObjectUrl = URL.createObjectURL(normalizedFile)
    accountAvatarPreviewUrl.value = accountAvatarPreviewObjectUrl
  }

  const resetAccountAvatar = () => {
    clearAccountAvatarUploadValue()
    accountAvatarFile.value = undefined
    accountAvatarUploadDiagnostics.value = null
    accountAvatarWasReset.value = true
    clearAccountAvatarPreview()
  }

  const copyUserId = async () => {
    if (!displayedUserId.value || !isClipboardSupported.value) return

    await copy(displayedUserId.value)
    toast.add({ content: t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.userIdCopied) })
  }

  const copyUserNickname = async () => {
    if (!user.value.nickname || !isClipboardSupported.value) return

    await copy(user.value.nickname)
    toast.add({ content: t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.nicknameCopied) })
  }

  const captureAccountAvatarUpdateFailure = (error: unknown) => {
    if (!accountAvatarChanged.value) return

    withClientSentryScope((scope) => {
      scope.setTag('settings.account.update.reason', 'avatar')
      scope.setContext('settings_account_avatar_update', {
        avatarReset: accountAvatarWasReset.value,
        file: buildAccountAvatarFileDiagnostics(accountAvatarFile.value),
        hasCurrentAvatar: Boolean(avatarId.value),
        nicknameChanged: accountNicknameChanged.value,
        upload: accountAvatarUploadDiagnostics.value
      })
      captureClientSentryException(error)
    })
  }

  const updateAccountData = async () => {
    const nickname = formData.nickname.value
    const currentAvatarId = avatarId.value

    if (isAccountSaveDisabled.value || !isNicknameValid(nickname)) return

    const requestFormData = new FormData()

    requestFormData.append('nickname', nickname)
    requestFormData.append('reset-avatar', accountAvatarWasReset.value ? 'reset' : '')

    if (accountAvatarFile.value) {
      requestFormData.append('file', accountAvatarFile.value, accountAvatarFile.value.name)
    }

    try {
      isAccountSaving.value = true
      const response = await doHttpRequest<UserData>('patch', USER_ENDPOINTS.editUserData, requestFormData)
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
      accountAvatarUploadDiagnostics.value = null
      accountAvatarWasReset.value = false
      clearAccountAvatarUploadValue()
      clearAccountAvatarPreview()
    } catch (error) {
      if (isExpectedHttpError(error)) return

      captureAccountAvatarUpdateFailure(error)
      throw error
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
    displayedUserId,
    isAccountSaveDisabled,
    isAccountSaving,
    copyUserId,
    copyUserNickname,
    resetAccountAvatar,
    updateAccountData,
    uploadAccountAvatar
  }
}
