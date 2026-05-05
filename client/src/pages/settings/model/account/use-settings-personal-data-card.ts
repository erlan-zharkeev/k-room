import {
  USER_ENDPOINTS,
  createUpdateUserDataSchema,
  createValidationMessages,
  formatNickname,
  isNicknameValid,
  normalizeNickname
} from 'global-shared'
import { safeParse } from 'valibot'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { translate, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE } from '../../config/constants'
import { SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N } from '../../config/i18n/account-personal-data-card'

export const useSettingsPersonalDataCard = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const { user, avatarId, update: updateUserData } = useUser()
  const { doRequest } = useApi()
  const { t } = useI18n()
  const toast = useAppToast()
  const accountNickname = ref('')
  const accountAvatarFile = ref<File>()
  const accountAvatarPreviewUrl = ref('')
  const accountAvatarWasReset = ref(false)
  const isAccountSaving = ref(false)
  const avatarUploadKey = ref(0)
  const accountNicknameSchema = createUpdateUserDataSchema(createValidationMessages(t))

  let accountAvatarPreviewObjectUrl: string | undefined

  const displayedAvatarId = computed(() =>
    accountAvatarPreviewUrl.value || accountAvatarWasReset.value ? undefined : avatarId.value || undefined
  )
  const displayedNickname = computed(() => formatNickname(user.value.nickname))
  const displayedUserId = computed(() => (user.value.id ? `#${user.value.id}` : ''))
  const normalizedAccountNickname = computed(() => normalizeNickname(accountNickname.value))
  const isAccountNicknameEmpty = computed(() => !normalizedAccountNickname.value)
  const accountNicknameChanged = computed(
    () => normalizedAccountNickname.value !== normalizeNickname(user.value.nickname)
  )
  const accountAvatarChanged = computed(() => Boolean(accountAvatarFile.value || accountAvatarWasReset.value))
  const hasAccountChanges = computed(() => accountNicknameChanged.value || accountAvatarChanged.value)
  const accountNicknameError = computed(() => {
    if (!accountNickname.value) return ''

    const result = safeParse(accountNicknameSchema, { nickname: accountNickname.value }, { abortPipeEarly: true })

    return result.success ? '' : result.issues[0]?.message || ''
  })
  const isAccountSaveDisabled = computed(
    () =>
      !user.value.id || !hasAccountChanges.value || isAccountNicknameEmpty.value || Boolean(accountNicknameError.value)
  )

  const clearAccountAvatarPreview = () => {
    if (!accountAvatarPreviewObjectUrl) return

    URL.revokeObjectURL(accountAvatarPreviewObjectUrl)
    accountAvatarPreviewObjectUrl = undefined
    accountAvatarPreviewUrl.value = ''
  }

  const resetAvatarUpload = () => {
    avatarUploadKey.value += 1
  }

  const uploadAccountAvatar = (files: File[]) => {
    const file = files[files.length - 1]

    if (!file) {
      accountAvatarFile.value = undefined
      accountAvatarWasReset.value = false
      clearAccountAvatarPreview()
      resetAvatarUpload()

      return
    }

    if (file.size > SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE) {
      resetAvatarUpload()

      return
    }

    clearAccountAvatarPreview()
    accountAvatarFile.value = file
    accountAvatarWasReset.value = false
    accountAvatarPreviewObjectUrl = URL.createObjectURL(file)
    accountAvatarPreviewUrl.value = accountAvatarPreviewObjectUrl
    resetAvatarUpload()
  }

  const resetAccountAvatar = () => {
    accountAvatarFile.value = undefined
    accountAvatarWasReset.value = true
    clearAccountAvatarPreview()
    resetAvatarUpload()
  }

  const copyUserId = async () => {
    if (!displayedUserId.value) return

    try {
      await navigator.clipboard.writeText(displayedUserId.value)
      toast.add({ content: translate(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.userIdCopied) })
    } catch (error) {
      void error
    }
  }

  const copyUserNickname = async () => {
    if (!displayedNickname.value) return

    try {
      await navigator.clipboard.writeText(displayedNickname.value)
      toast.add({ content: translate(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.nicknameCopied) })
    } catch (error) {
      void error
    }
  }

  const updateAccountData = async () => {
    const nickname = normalizedAccountNickname.value
    const currentAvatarId = avatarId.value

    if (isAccountSaveDisabled.value || !isNicknameValid(nickname)) return

    const formData = new FormData()

    formData.append('nickname', nickname)
    formData.append('reset-avatar', accountAvatarWasReset.value ? 'reset' : '')

    if (accountAvatarFile.value) {
      formData.append('file', accountAvatarFile.value)
    }

    try {
      isAccountSaving.value = true
      await doRequest('patch', USER_ENDPOINTS.editUserData, formData, {
        contentType: 'multipart/form-data'
      })
      await updateUserData({ nickname })

      if (currentAvatarId && accountAvatarWasReset.value) {
        await removeMedia(currentAvatarId)
      }

      if (currentAvatarId && accountAvatarFile.value) {
        await putMedia({
          id: currentAvatarId,
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
      clearAccountAvatarPreview()
      resetAvatarUpload()
    } finally {
      isAccountSaving.value = false
    }
  }

  watch(
    () => user.value.nickname,
    (nickname) => {
      accountNickname.value = nickname
    },
    { immediate: true }
  )

  onBeforeUnmount(clearAccountAvatarPreview)

  return {
    user,
    accountNickname,
    accountAvatarPreviewUrl,
    displayedAvatarId,
    displayedNickname,
    displayedUserId,
    accountNicknameError,
    isAccountSaveDisabled,
    isAccountSaving,
    avatarUploadKey,
    copyUserId,
    copyUserNickname,
    resetAccountAvatar,
    updateAccountData,
    uploadAccountAvatar
  }
}
