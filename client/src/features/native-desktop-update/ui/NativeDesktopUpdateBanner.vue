<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { NATIVE_DESKTOP_UPDATE_I18N } from '../config/i18n'
import { useNativeDesktopUpdate } from '../model/use-native-desktop-update.model'

const { appName } = __CLIENT_ENV_DATA__
const {
  dismissNativeDesktopUpdate,
  downloadProgress,
  hasInstallError,
  installNativeDesktopUpdate,
  isInstalling,
  showNativeDesktopUpdateBanner,
  updateVersion
} = useNativeDesktopUpdate()
</script>

<template>
  <aside v-if="showNativeDesktopUpdateBanner" class="native-desktop-update-banner" aria-live="polite">
    <div class="native-desktop-update-banner__content">
      <AppText color="contrast-text" bold :text="$t(NATIVE_DESKTOP_UPDATE_I18N.title)(appName, updateVersion)" />
      <AppText
        v-if="isInstalling"
        color="semi-contrast-text"
        :text="$t(NATIVE_DESKTOP_UPDATE_I18N.installing)(downloadProgress)"
      />
      <AppText v-else-if="hasInstallError" color="warn" :text="$t(NATIVE_DESKTOP_UPDATE_I18N.installFailed)" />
      <AppText v-else color="semi-contrast-text" :text="$t(NATIVE_DESKTOP_UPDATE_I18N.description)" />
    </div>

    <div class="native-desktop-update-banner__actions">
      <NmorphButton
        fill
        :disabled="isInstalling"
        :loading="isInstalling"
        :text="$t(NATIVE_DESKTOP_UPDATE_I18N.installAction)"
        @click="installNativeDesktopUpdate"
      />
      <NmorphButton
        :disabled="isInstalling"
        :text="$t(NATIVE_DESKTOP_UPDATE_I18N.dismissAction)"
        @click="dismissNativeDesktopUpdate"
      />
    </div>
  </aside>
</template>

<style lang="scss">
.native-desktop-update-banner {
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

.native-desktop-update-banner__content {
  display: grid;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.native-desktop-update-banner__actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

@media (width <= 520px) {
  .native-desktop-update-banner {
    display: grid;
  }

  .native-desktop-update-banner__actions {
    justify-content: end;
  }
}
</style>
