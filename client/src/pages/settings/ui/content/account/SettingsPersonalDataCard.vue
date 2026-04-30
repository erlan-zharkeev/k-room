<script setup lang="ts">
import { Button, FileUpload, InputText, Message } from 'primevue'

import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_AVATAR_ACCEPT, SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE } from '../../../config/constants'
import { SETTINGS_PAGE_I18N } from '../../../config/i18n'
import { useSettingsPersonalDataCard } from '../../../model/account/use-settings-personal-data-card'
import SettingsCard from '../../SettingsCard.vue'

const {
  user,
  accountNickname,
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
} = useSettingsPersonalDataCard()
</script>

<template>
  <SettingsCard
    :button-aria-label="$t(SETTINGS_PAGE_I18N.updateAccountData)"
    :button-disabled="isAccountSaveDisabled"
    :button-label="$t(SETTINGS_PAGE_I18N.updateAccountData)"
    :button-loading="isAccountSaving"
    :on-button-click="updateAccountData"
    :title="$t(SETTINGS_PAGE_I18N.personalData)"
  >
    <div class="settings-personal-data-card__profile">
      <AppProfileBasicData
        :image-alt="user.nickname"
        :image-id="displayedAvatarId"
        :image-src="accountAvatarPreviewUrl || undefined"
        :title="displayedNickname"
      >
        <template #title>
          <div class="settings-personal-data-card__profile-title">
            <AppHeader tag="h5" truncate :text="displayedNickname" />
            <Button
              class="settings-personal-data-card__copy-button"
              :aria-label="$t(SETTINGS_PAGE_I18N.copyNickname)"
              icon="pi pi-copy"
              size="small"
              text
              type="button"
              @click="copyUserNickname"
            />
          </div>
        </template>
        <template #description>
          <div v-if="user.id" class="settings-personal-data-card__profile-description">
            <AppText tag="small" :text="displayedUserId" />
            <Button
              class="settings-personal-data-card__copy-button"
              :aria-label="$t(SETTINGS_PAGE_I18N.copyId)"
              icon="pi pi-copy"
              size="small"
              text
              type="button"
              @click="copyUserId"
            />
          </div>
        </template>
      </AppProfileBasicData>
    </div>

    <div class="settings-personal-data-card__actions">
      <FileUpload
        mode="basic"
        auto
        :accept="SETTINGS_ACCOUNT_AVATAR_ACCEPT"
        :max-file-size="SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE"
        :multiple="false"
        :choose-label="$t(SETTINGS_PAGE_I18N.uploadPhoto)"
        class="settings-personal-data-card__file-button"
        :choose-button-props="{
          text: true,
          size: 'small'
        }"
        @select="uploadAccountAvatar"
      >
        <template #filelabel />
      </FileUpload>
      <Button :label="$t(SETTINGS_PAGE_I18N.resetPhoto)" size="small" text type="button" @click="resetAccountAvatar" />
    </div>

    <label class="settings-personal-data-card__field">
      <AppText tag="small" :text="$t(SETTINGS_PAGE_I18N.nickname)" />
      <InputText v-model.trim="accountNickname" autocomplete="nickname" fluid size="small" />
      <Message v-if="accountNicknameError" severity="error" size="small" variant="simple">
        {{ accountNicknameError }}
      </Message>
    </label>
  </SettingsCard>
</template>

<style lang="scss">
.settings-personal-data-card__profile,
.settings-personal-data-card__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.settings-personal-data-card__profile-description {
  display: flex;
  gap: 8px;
  align-items: center;
}

.settings-personal-data-card__profile-title {
  display: flex;
  gap: 4px;
  align-items: center;
}

.settings-personal-data-card__actions {
  flex-wrap: wrap;
}

.settings-personal-data-card__field {
  display: grid;
  gap: 8px;
}

.settings-personal-data-card__copy-button {
  flex: 0 0 auto;
}

.settings-personal-data-card__file-button {
  display: block;
}

.settings-personal-data-card__file-button :deep(.p-button) {
  min-height: 36px;
}
</style>
