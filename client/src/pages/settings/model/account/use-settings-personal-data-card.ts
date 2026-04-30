import { USER_ENDPOINTS } from 'global-shared'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { useApi } from 'src/shared/api'

export const useSettingsPersonalDataCard = () => {
  const { put: putMedia, remove: removeMedia } = useMedia()
  const { user, avatarId, shallowUpdate: updateUserData } = useUser()
  const { doRequest } = useApi()
  const accountUsername = ref('')
  const accountAvatarFile = ref<File>()
  const accountAvatarPreviewUrl = ref('')
  const accountAvatarWasReset = ref(false)
  const isAccountSaving = ref(false)

  let accountAvatarPreviewObjectUrl: string | undefined

  const displayedAvatarId = computed(() =>
    accountAvatarPreviewUrl.value || accountAvatarWasReset.value ? undefined : avatarId.value || undefined
  )
  const isAccountSaveDisabled = computed(() => !user.value.id || !accountUsername.value.trim())

  const clearAccountAvatarPreview = () => {
    if (!accountAvatarPreviewObjectUrl) return

    URL.revokeObjectURL(accountAvatarPreviewObjectUrl)
    accountAvatarPreviewObjectUrl = undefined
    accountAvatarPreviewUrl.value = ''
  }

  const uploadAccountAvatar = ({ files }: FileUploadSelectEvent) => {
    const file = Array.isArray(files) ? files[0] : undefined

    if (!file) return

    clearAccountAvatarPreview()
    accountAvatarFile.value = file
    accountAvatarWasReset.value = false
    accountAvatarPreviewObjectUrl = URL.createObjectURL(file)
    accountAvatarPreviewUrl.value = accountAvatarPreviewObjectUrl
  }

  const resetAccountAvatar = () => {
    accountAvatarFile.value = undefined
    accountAvatarWasReset.value = true
    clearAccountAvatarPreview()
  }

  const updateAccountData = async () => {
    const username = accountUsername.value.trim()
    const currentAvatarId = avatarId.value

    if (!user.value.id || !username) return

    const formData = new FormData()

    formData.append('username', username)
    formData.append('reset-avatar', accountAvatarWasReset.value ? 'reset' : '')

    if (accountAvatarFile.value) {
      formData.append('file', accountAvatarFile.value)
    }

    try {
      isAccountSaving.value = true
      await doRequest<null>('patch', USER_ENDPOINTS.editUserData, formData, {
        contentType: 'multipart/form-data'
      })
      await updateUserData({ username })

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
    } finally {
      isAccountSaving.value = false
    }
  }

  watch(
    () => user.value.username,
    (username) => {
      accountUsername.value = username
    },
    { immediate: true }
  )

  onBeforeUnmount(clearAccountAvatarPreview)

  return {
    user,
    accountUsername,
    accountAvatarPreviewUrl,
    displayedAvatarId,
    isAccountSaveDisabled,
    isAccountSaving,
    resetAccountAvatar,
    updateAccountData,
    uploadAccountAvatar
  }
}
