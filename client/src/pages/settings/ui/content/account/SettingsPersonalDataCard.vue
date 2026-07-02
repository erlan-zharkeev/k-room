<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphFileUpload,
  NmorphForm,
  NmorphFormItem,
  NmorphIcon,
  NmorphIconCopy,
  NmorphTextInput,
  NmorphCallout
} from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData } from 'src/shared/ui'

import {
  SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES,
  SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL,
  SETTINGS_ACCOUNT_AVATAR_MAX_MB
} from '../../../config/constants/account.constants'
import { SETTINGS_ACCOUNT_PERSONAL_DATA_I18N } from '../../../config/i18n/account-personal-data.i18n'
import { usePersonalData } from '../../../model/account/use-personal-data.model'
import SettingsCard from '../../SettingsCard.vue'

const {
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
} = usePersonalData()
</script>

<template>
  <SettingsCard
    :button-aria-label="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.updateAccountData)"
    :button-disabled="isAccountSaveDisabled"
    :button-label="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.updateAccountData)"
    :button-loading="isAccountSaving"
    :on-button-click="updateAccountData"
    :title="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.personalData)"
  >
    <div class="settings-personal-data-card__profile">
      <AppProfileBasicData
        :image-alt="user.nickname"
        :image-id="displayedAvatarId"
        :image-src="accountAvatarPreviewUrl || undefined"
        :title="user.nickname"
        :name="user.nickname"
      >
        <template #title>
          <div class="settings-personal-data-card__profile-title">
            <NmorphText weight="bold">{{ user.nickname }}</NmorphText>
            <NmorphButton
              class="settings-personal-data-card__copy-button"
              design="plain"
              borderless
              thickness="thin"
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
            <NmorphText as="small" variant="body-small">{{ displayedUserId }}</NmorphText>
            <NmorphButton
              class="settings-personal-data-card__copy-button"
              design="plain"
              borderless
              thickness="thin"
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

    <NmorphForm :value="formData" @submit.prevent="updateAccountData">
      <NmorphFormItem id="avatar" :show-validation-icon="false">
        <div class="settings-personal-data-card__avatar-field">
          <div class="settings-personal-data-card__actions">
            <NmorphFileUpload
              :allowed-types="SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES"
              :button-text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.uploadPhoto)"
              :disabled="isAccountSaving"
              :model-value="accountAvatarUploadValue"
              :multiple="false"
              file-name-width="174px"
              @update:model-value="uploadAccountAvatar"
            />
            <NmorphButton
              class="settings-personal-data-card__reset-button"
              design="plain"
              borderless
              :disabled="isAccountSaving"
              :text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.resetPhoto)"
              @click="resetAccountAvatar"
            />
          </div>
          <NmorphCallout
            type="info"
            :content="`${$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.uploadPhotoRequirements)} ${$t(
              SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.uploadPhotoHint,
              { formats: SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL, maxMb: SETTINGS_ACCOUNT_AVATAR_MAX_MB }
            )}`"
          />
        </div>
      </NmorphFormItem>

      <NmorphFormItem
        id="nickname"
        :label="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.nickname)"
        :show-validation-icon="false"
      >
        <NmorphTextInput v-model.trim="formData.nickname.value" :disabled="isAccountSaving" />
      </NmorphFormItem>
    </NmorphForm>
  </SettingsCard>
</template>

<style lang="scss" scoped>
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
  width: 100%;
}

.settings-personal-data-card__avatar-field {
  display: grid;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.settings-personal-data-card__copy-button {
  flex: 0 0 auto;
}

.settings-personal-data-card__reset-button {
  margin-left: auto;
}

.settings-personal-data-card__reset-button :deep(.nmorph-button__content) {
  padding: 0;
}
</style>
