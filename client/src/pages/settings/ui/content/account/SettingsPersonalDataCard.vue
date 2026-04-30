<script setup lang="ts">
import { Button, FileUpload, InputText } from 'primevue'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import { SETTINGS_ACCOUNT_AVATAR_ACCEPT, SETTINGS_ACCOUNT_AVATAR_MAX_FILE_SIZE } from '../../../config/constants'
import { SETTINGS_PAGE_I18N } from '../../../config/i18n'
import { useSettingsPersonalDataCard } from '../../../model/account/use-settings-personal-data-card'
import SettingsCard from '../../SettingsCard.vue'

const {
  user,
  accountUsername,
  accountAvatarPreviewUrl,
  displayedAvatarId,
  isAccountSaveDisabled,
  isAccountSaving,
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
      <Button
        :label="$t(SETTINGS_PAGE_I18N.resetPhoto)"
        size="small"
        text
        type="button"
        @click="resetAccountAvatar"
      />
    </div>

    <label class="settings-personal-data-card__field">
      <AppText size="small" :text="$t(SETTINGS_PAGE_I18N.username)" />
      <InputText v-model="accountUsername" autocomplete="username" fluid size="small" />
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

.settings-personal-data-card__actions {
  flex-wrap: wrap;
}

.settings-personal-data-card__field {
  display: grid;
  gap: 8px;
}

.settings-personal-data-card__file-button {
  display: block;
}

.settings-personal-data-card__file-button :deep(.p-button) {
  min-height: 36px;
}
</style>
