<script setup lang="ts">
import {
  NmorphButton,
  NmorphFileUpload,
  NmorphForm,
  NmorphFormItem,
  NmorphIcon,
  NmorphIconCopy,
  NmorphTextInput,
  NmorphCallout
} from '@nmorph/nmorph-ui-kit'

import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import {
  SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES,
  SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL,
  SETTINGS_ACCOUNT_AVATAR_MAX_MB,
  SETTINGS_ACCOUNT_NICKNAME_INPUT_ATTRS
} from '../../../config/constants/account.constants'
import { SETTINGS_ACCOUNT_PERSONAL_DATA_I18N } from '../../../config/i18n/account-personal-data.i18n'
import { usePersonalData } from '../../../model/account/use-personal-data.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  user,
  formData,
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
        :title="displayedNickname"
        :name="user.nickname"
      >
        <template #title>
          <div class="settings-personal-data-card__profile-title">
            <AppText bold :selectable="false" :text="displayedNickname" />
            <NmorphButton
              class="settings-personal-data-card__copy-button"
              style-type="transparent"
              height='thin'
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
            <AppText tag="small" :selectable="false" :text="displayedUserId" />
            <NmorphButton
              class="settings-personal-data-card__copy-button"
              style-type="transparent"
              height='thin'
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
              :key="avatarUploadKey"
              :allowed-types="SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES"
              :button-text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.uploadPhoto)"
              :disabled="isAccountSaving"
              :multiple="false"
              class="settings-personal-data-card__file-button"
              @update:model-value="uploadAccountAvatar"
            />
            <NmorphButton
              style-type="transparent"
              :disabled="isAccountSaving"
              :text="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.resetPhoto)"
              @click="resetAccountAvatar"
            />
          </div>
          <NmorphCallout
            type="warning"
            :content="`${$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.uploadPhotoRequirements)} ${$t(
              SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.uploadPhotoHint
            )(SETTINGS_ACCOUNT_AVATAR_ALLOWED_TYPES_LABEL, SETTINGS_ACCOUNT_AVATAR_MAX_MB)}`"
          />
        </div>
      </NmorphFormItem>

      <NmorphFormItem
        id="nickname"
        :label="$t(SETTINGS_ACCOUNT_PERSONAL_DATA_I18N.nickname)"
        :show-validation-icon="false"
      >
        <NmorphTextInput
          v-model="formData.nickname.value"
          :disabled="isAccountSaving"
          :input-attrs="SETTINGS_ACCOUNT_NICKNAME_INPUT_ATTRS"
        />
        <AppText v-if="accountNicknameError" tag="small" color="warn" :text="accountNicknameError" />
      </NmorphFormItem>
    </NmorphForm>
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

.settings-personal-data-card__avatar-field {
  display: grid;
  gap: 8px;
}

.settings-personal-data-card__copy-button {
  flex: 0 0 auto;
}
</style>
