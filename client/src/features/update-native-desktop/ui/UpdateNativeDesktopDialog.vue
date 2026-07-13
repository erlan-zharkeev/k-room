<script setup lang="ts">
import { NmorphButton, NmorphText } from '@nmorph/nmorph-ui-kit'

import { AppDialog } from 'src/shared/ui'

import { UPDATE_NATIVE_DESKTOP_I18N } from '../config/i18n'
import { useUpdateNativeDesktop } from '../model/use-update-native-desktop.model'

const { appName } = __CLIENT_ENV_DATA__
const {
  downloadProgress,
  hasInstallError,
  installUpdateNativeDesktop,
  isInstalling,
  showUpdateNativeDesktopDialog,
  updateNativeDesktopDialogVisibility,
  updateVersion
} = useUpdateNativeDesktop()
</script>

<template>
  <AppDialog
    :model-value="showUpdateNativeDesktopDialog"
    :title="$t(UPDATE_NATIVE_DESKTOP_I18N.title, { appName: appName, version: updateVersion })"
    :show-close="!isInstalling"
    :close-on-overlay="!isInstalling"
    :close-on-escape="!isInstalling"
    variant="default"
    @update:model-value="updateNativeDesktopDialogVisibility"
  >
    <div class="update-native-desktop-dialog" aria-live="polite">
      <NmorphText v-if="isInstalling" color="semi-contrast">
        {{ $t(UPDATE_NATIVE_DESKTOP_I18N.installing, { progress: downloadProgress }) }}
      </NmorphText>
      <NmorphText v-else-if="hasInstallError" color="var(--nmorph-warn-text-color)">
        {{ $t(UPDATE_NATIVE_DESKTOP_I18N.installFailed) }}
      </NmorphText>
      <NmorphText v-else color="semi-contrast">
        {{ $t(UPDATE_NATIVE_DESKTOP_I18N.description) }}
      </NmorphText>

      <div class="update-native-desktop-dialog__actions">
        <NmorphButton
          design="plain"
          borderless
          :disabled="isInstalling"
          :loading="isInstalling"
          :text="$t(UPDATE_NATIVE_DESKTOP_I18N.installAction)"
          @click="installUpdateNativeDesktop"
        />
      </div>
    </div>
  </AppDialog>
</template>

<style lang="scss" scoped>
.update-native-desktop-dialog {
  display: grid;
  gap: 16px;
}

.update-native-desktop-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: end;
}
</style>
