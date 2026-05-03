<script setup lang="ts">
import { NmorphButton, NmorphFileUpload, NmorphIcon, NmorphIconCopy, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import {
  SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES,
  SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL,
  SETTINGS_ACCOUNT_AVATAR_MAX_MB
} from '../../../config/constants'
import { SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N } from '../../../config/i18n/account-personal-data-card'
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
  avatarUploadKey,
  copyUserId,
  copyUserNickname,
  resetAccountAvatar,
  updateAccountData,
  uploadAccountAvatar
} = useSettingsPersonalDataCard()
</script>

<template>
  <SettingsCard
    :button-aria-label="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.updateAccountData)"
    :button-disabled="isAccountSaveDisabled"
    :button-label="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.updateAccountData)"
    :button-loading="isAccountSaving"
    :on-button-click="updateAccountData"
    :title="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.personalData)"
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
            <NmorphButton
              class="settings-personal-data-card__copy-button"
              style-type="transparent"
              :disabled="isAccountSaving"
              @click="copyUserNickname"
            >
              <template #icon>
                <NmorphIcon>
                  <NmorphIconCopy />
                </NmorphIcon>
              </template>
            </NmorphButton>
          </div>
        </template>
        <template #description>
          <div v-if="user.id" class="settings-personal-data-card__profile-description">
            <AppText tag="small" :text="displayedUserId" />
            <NmorphButton
              class="settings-personal-data-card__copy-button"
              height="thin"
              style-type="transparent"
              :disabled="isAccountSaving"
              @click="copyUserId"
            >
              <template #icon>
                <NmorphIcon>
                  <NmorphIconCopy />
                </NmorphIcon>
              </template>
            </NmorphButton>
          </div>
        </template>
      </AppProfileBasicData>
    </div>

    <div class="settings-personal-data-card__actions">
      <NmorphFileUpload
        :key="avatarUploadKey"
        :allowed-types="SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES"
        :button-text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.uploadPhoto)"
        :disabled="isAccountSaving"
        :multiple="false"
        class="settings-personal-data-card__file-button"
        @update:model-value="uploadAccountAvatar"
      />
      <NmorphButton
        style-type="transparent"
        :disabled="isAccountSaving"
        :text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.resetPhoto)"
        @click="resetAccountAvatar"
      />
    </div>
    <AppText
      tag="small"
      color="semi-contrast-color"
      :text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.uploadPhotoHint)(SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL, SETTINGS_ACCOUNT_AVATAR_MAX_MB)"
    />

    <label class="settings-personal-data-card__field">
      <AppText tag="small" :text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N.nickname)" />
      <NmorphTextInput v-model="accountNickname" :disabled="isAccountSaving" />
      <AppText v-if="accountNicknameError" tag="small" color="warn-color" :text="accountNicknameError" />
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
  flex-wrap: wrap;
  gap: 8px;
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
</style>
