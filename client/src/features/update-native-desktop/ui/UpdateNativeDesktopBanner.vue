<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

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
      <AppText
        color="contrast-text"
        bold
        :text="$t(UPDATE_NATIVE_DESKTOP_I18N.title, { appName: appName, version: updateVersion })"
      />
      <AppText
        v-if="isInstalling"
        color="semi-contrast-text"
        :text="$t(UPDATE_NATIVE_DESKTOP_I18N.installing, { progress: downloadProgress })"
      />
      <AppText v-else-if="hasInstallError" color="warn" :text="$t(UPDATE_NATIVE_DESKTOP_I18N.installFailed)" />
      <AppText v-else color="semi-contrast-text" :text="$t(UPDATE_NATIVE_DESKTOP_I18N.description)" />
    </div>

    <div class="update-native-desktop-banner__actions">
      <NmorphButton
        fill
        :disabled="isInstalling"
        :loading="isInstalling"
        :text="$t(UPDATE_NATIVE_DESKTOP_I18N.installAction)"
        @click="installUpdateNativeDesktop"
      />
      <NmorphButton
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

  width: min(520px, calc(100vw - 32px));
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
}

@media (width <= 520px) {
  .update-native-desktop-banner {
    display: grid;
  }

  .update-native-desktop-banner__actions {
    justify-content: end;
  }
}
</style>
