<script setup lang="ts">
import { NmorphText, NmorphButton } from '@nmorph/nmorph-ui-kit'

import { UPDATE_NATIVE_DESKTOP_I18N } from '../config/i18n'
import { useUpdateNativeDesktop } from '../model/use-update-native-desktop.model'

const { appName } = __CLIENT_ENV_DATA__
const {
  dismissUpdateNativeDesktop,
  downloadProgress,
  hasInstallError,
  installUpdateNativeDesktop,
  isInstalling,
  showUpdateNativeDesktopBanner,
  updateVersion
} = useUpdateNativeDesktop()
</script>

<template>
  <aside v-if="showUpdateNativeDesktopBanner" class="update-native-desktop-banner" aria-live="polite">
    <div class="update-native-desktop-banner__content">
      <NmorphText color="var(--nmorph-contrast-text-color)" weight="bold">{{
        $t(UPDATE_NATIVE_DESKTOP_I18N.title, { appName: appName, version: updateVersion })
      }}</NmorphText>
      <NmorphText v-if="isInstalling" color="semi-contrast">{{
        $t(UPDATE_NATIVE_DESKTOP_I18N.installing, { progress: downloadProgress })
      }}</NmorphText>
      <NmorphText v-else-if="hasInstallError" color="var(--nmorph-warn-text-color)">{{
        $t(UPDATE_NATIVE_DESKTOP_I18N.installFailed)
      }}</NmorphText>
      <NmorphText v-else color="semi-contrast">{{ $t(UPDATE_NATIVE_DESKTOP_I18N.description) }}</NmorphText>
    </div>

    <div class="update-native-desktop-banner__actions">
      <NmorphButton
        class="update-native-desktop-banner__action"
        :disabled="isInstalling"
        :loading="isInstalling"
        :text="$t(UPDATE_NATIVE_DESKTOP_I18N.installAction)"
        @click="installUpdateNativeDesktop"
      />
      <NmorphButton
        class="update-native-desktop-banner__action"
        :disabled="isInstalling"
        :text="$t(UPDATE_NATIVE_DESKTOP_I18N.dismissAction)"
        @click="dismissUpdateNativeDesktop"
      />
    </div>
  </aside>
</template>

<style lang="scss">
.update-native-desktop-banner {
  position: fixed;
  z-index: 20;
  right: 16px;
  bottom: 16px;

  display: flex;
  gap: 16px;
  align-items: center;

  width: min(720px, calc(100vw - 32px));
  padding: 12px;
  border: var(--nmorph-plain-border);
  border-radius: 8px;

  background: var(--nmorph-main-color);
  box-shadow: var(--nmorph-shadow-outset);
}

.update-native-desktop-banner__content {
  display: grid;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.update-native-desktop-banner__actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
}

.update-native-desktop-banner__action {
  flex: 0 0 auto;
  min-width: 96px;
}

.update-native-desktop-banner__action .nmorph-button__label {
  overflow-wrap: normal;
  white-space: nowrap;
}

@media (width <= 520px) {
  .update-native-desktop-banner {
    display: grid;
  }

  .update-native-desktop-banner__actions {
    justify-content: end;
  }

  .update-native-desktop-banner__action {
    min-width: 104px;
  }
}
</style>
