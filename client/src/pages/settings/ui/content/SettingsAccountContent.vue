<script setup lang="ts">
import { USER_ENDPOINTS } from 'global-shared'
import { Button, FileUpload, InputText, Message, Password } from 'primevue'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_AVATAR_ACCEPT, SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE } from '../../config/constants'
import { SETTINGS_PAGE_I18N } from '../../config/i18n'

const { put: putMedia, remove: removeMedia } = useMedia()
const { user, avatarId, shallowUpdate: updateUserData } = useUser()
const { doRequest } = useApi()

const accountUsername = ref('')
const accountAvatarFile = ref<File>()
const accountAvatarPreviewUrl = ref('')
const accountAvatarWasReset = ref(false)
const isAccountSaving = ref(false)
const currentPassword = ref('')
const nextPassword = ref('')
const repeatPassword = ref('')
const isPasswordChanging = ref(false)
let accountAvatarPreviewObjectUrl: string | undefined

const displayedAvatarId = computed(() =>
  accountAvatarPreviewUrl.value || accountAvatarWasReset.value ? undefined : avatarId.value || undefined
)
const passwordMismatch = computed(() => Boolean(repeatPassword.value && nextPassword.value !== repeatPassword.value))
const isAccountSaveDisabled = computed(() => !user.value.id || !accountUsername.value.trim())
const isPasswordSubmitDisabled = computed(
  () => !currentPassword.value || !nextPassword.value || !repeatPassword.value || passwordMismatch.value
)

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

const changePassword = async () => {
  if (isPasswordSubmitDisabled.value) return

  try {
    isPasswordChanging.value = true
    await doRequest<null>('patch', USER_ENDPOINTS.changePassword, {
      currentPassword: currentPassword.value,
      password: nextPassword.value
    })
    currentPassword.value = ''
    nextPassword.value = ''
    repeatPassword.value = ''
  } finally {
    isPasswordChanging.value = false
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
</script>

<template>
  <div class="settings-account-content">
    <div class="settings-account-content__section">
      <div class="settings-account-content__profile">
        <AppProfileBasicData
          :image-alt="user.username"
          :image-id="displayedAvatarId"
          :image-src="accountAvatarPreviewUrl || undefined"
          :title="user.username"
        >
          <template #description>
            <AppText v-if="user.id" size="small" :text="`#${user.id}`" />
          </template>
        </AppProfileBasicData>
      </div>

      <div class="settings-account-content__actions">
        <FileUpload
          mode="basic"
          auto
          :accept="SETTINGS_ACCOUNT_AVATAR_ACCEPT"
          :max-file-size="SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE"
          :multiple="false"
          :choose-label="$t(SETTINGS_PAGE_I18N.uploadPhoto)"
          class="settings-account-content__file-button"
          :choose-button-props="{
            text: true,
            size: 'small'
          }"
          @select="uploadAccountAvatar"
        >
          <template #filelabel />
        </FileUpload>
        <Button
          :label="$t(SETTINGS_PAGE_I18N.resetPhoto)"
          size="small"
          text
          type="button"
          @click="resetAccountAvatar"
        />
      </div>

      <label class="settings-account-content__field">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.username)" />
        <InputText v-model="accountUsername" autocomplete="username" fluid size="small" />
      </label>

      <Button
        class="settings-account-content__submit"
        :disabled="isAccountSaveDisabled"
        :label="$t(SETTINGS_PAGE_I18N.updateAccountData)"
        :loading="isAccountSaving"
        size="small"
        type="button"
        @click="updateAccountData"
      />
    </div>

    <div class="settings-account-content__section">
      <div class="settings-account-content__section-title">
        <AppHeader tag="h2" size="small" color="contrast-color" :text="$t(SETTINGS_PAGE_I18N.changePassword)" />
      </div>

      <label class="settings-account-content__field">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.currentPassword)" />
        <Password
          v-model="currentPassword"
          :feedback="false"
          autocomplete="current-password"
          fluid
          size="small"
          toggle-mask
        />
      </label>

      <label class="settings-account-content__field">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.newPassword)" />
        <Password v-model="nextPassword" autocomplete="new-password" fluid size="small" toggle-mask />
      </label>

      <label class="settings-account-content__field">
        <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.confirmPassword)" />
        <Password
          v-model="repeatPassword"
          :feedback="false"
          autocomplete="new-password"
          fluid
          size="small"
          toggle-mask
        />
      </label>

      <Message v-if="passwordMismatch" severity="error" size="small" variant="simple">
        {{ $t(SETTINGS_PAGE_I18N.passwordMismatch) }}
      </Message>

      <Button
        class="settings-account-content__submit"
        :disabled="isPasswordSubmitDisabled"
        :label="$t(SETTINGS_PAGE_I18N.changePassword)"
        :loading="isPasswordChanging"
        size="small"
        type="button"
        @click="changePassword"
      />
    </div>
  </div>
</template>

<style lang="scss">
.settings-account-content {
  display: grid;
  gap: 12px;
  align-content: start;
}

.settings-account-content__section {
  display: grid;
  gap: 14px;
  align-content: start;

  padding: 14px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-app-muted-background);
}

.settings-account-content__profile,
.settings-account-content__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.settings-account-content__actions {
  flex-wrap: wrap;
}

.settings-account-content__field {
  display: grid;
  gap: 8px;
}

.settings-account-content__file-button {
  display: block;
}

.settings-account-content__file-button :deep(.p-button) {
  min-height: 36px;
}

.settings-account-content__submit {
  justify-self: start;
}
</style>
