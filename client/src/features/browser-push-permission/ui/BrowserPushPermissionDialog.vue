<script setup lang="ts">
import { NmorphButton, NmorphIcon, NmorphIconMuteNotification, NmorphText } from '@nmorph/nmorph-ui-kit'

import { AppDialog } from 'src/shared/ui'

import { BROWSER_PUSH_PERMISSION_I18N } from '../config/i18n'
import type { BrowserPushPermissionDialogEmit } from '../config/types'
import { useBrowserPushPermission } from '../model/use-browser-push-permission.model'

const emit = defineEmits<BrowserPushPermissionDialogEmit>()
const {
  browserPushPermissionDescription,
  browserPushPermissionTitle,
  dismissBrowserPushPermissionDialog,
  isBrowserNotificationPermissionDenied,
  isBrowserNotificationPermissionRequesting,
  isBrowserPushPermissionDialogVisible,
  openBrowserPushNotificationSettings,
  requestBrowserPushPermission
} = useBrowserPushPermission()

const enableBrowserPushNotifications = async () => {
  const permission = await requestBrowserPushPermission()

  if (permission === 'granted') {
    emit('complete', 'enabled')
  }
}

const postponeBrowserPushPermission = async () => {
  await dismissBrowserPushPermissionDialog()
  emit('complete', 'later')
}

const goToBrowserPushNotificationSettings = async () => {
  await openBrowserPushNotificationSettings()
  emit('complete', 'settings')
}

const updateBrowserPushPermissionDialogVisible = (visible: boolean) => {
  if (visible) return

  void postponeBrowserPushPermission()
}
</script>

<template>
  <AppDialog
    :model-value="isBrowserPushPermissionDialogVisible"
    show-close
    variant="default"
    close-on-overlay
    @update:model-value="updateBrowserPushPermissionDialogVisible"
  >
    <div class="browser-push-permission-dialog">
      <NmorphIcon class="browser-push-permission-dialog__icon" width="48px" height="48px">
        <NmorphIconMuteNotification />
      </NmorphIcon>
      <div class="browser-push-permission-dialog__content">
        <NmorphText as="h3" align="center" variant="title" weight="bold">
          {{ $t(browserPushPermissionTitle) }}
        </NmorphText>
        <NmorphText as="p" align="center" color="semi-contrast">
          {{ $t(browserPushPermissionDescription) }}
        </NmorphText>
        <div class="browser-push-permission-dialog__actions">
          <NmorphButton
            v-if="!isBrowserNotificationPermissionDenied"
            :loading="isBrowserNotificationPermissionRequesting"
            :text="$t(BROWSER_PUSH_PERMISSION_I18N.enable)"
            @click="enableBrowserPushNotifications"
          />
          <NmorphButton
            design="plain"
            borderless
            :text="$t(BROWSER_PUSH_PERMISSION_I18N.settings)"
            @click="goToBrowserPushNotificationSettings"
          />
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<style lang="scss" scoped>
.browser-push-permission-dialog {
  display: grid;
  gap: 12px;
  justify-items: center;
}

.browser-push-permission-dialog__icon {
  color: var(--nmorph-accent-color);
}

.browser-push-permission-dialog__content {
  display: grid;
  gap: 8px;
}

.browser-push-permission-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
</style>
