<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppHeader, AppText } from 'src/shared/ui'

import welcomeImageSrc from '../assets/welcome.webp'
import { APP_WELCOME_I18N } from '../config/i18n'
import type { AppWelcomeDialogEmit, AppWelcomeDialogProps } from '../config/types'
import { useAppWelcomeDialog } from '../model/use-app-welcome.model'

const props = withDefaults(defineProps<AppWelcomeDialogProps>(), {
  padding: '4px'
})
const emit = defineEmits<AppWelcomeDialogEmit>()
const { completeAppWelcome, dialogContentStyle, isAppWelcomeVisible, updateAppWelcomeVisible } = useAppWelcomeDialog(
  props,
  emit
)
</script>

<template>
  <NmorphDialog
    :model-value="isAppWelcomeVisible"
    max-width="calc(100vw - 32px)"
    :show-close="false"
    width="420px"
    close-on-overlay
    @update:model-value="updateAppWelcomeVisible"
  >
    <div class="app-welcome-dialog" :style="dialogContentStyle" tabindex="0">
      <img class="app-welcome-dialog__image" :src="welcomeImageSrc" :alt="$t(APP_WELCOME_I18N.imageAlt)" />
      <div class="app-welcome-dialog__content">
        <AppHeader tag="h3" alignment="center" :text="$t(APP_WELCOME_I18N.title)" />
        <AppText tag="p" alignment="center" color="semi-contrast-text" :text="$t(APP_WELCOME_I18N.description)" />
        <div class="app-welcome-dialog__actions">
          <NmorphButton design="plain" :text="$t(APP_WELCOME_I18N.action)" @click="completeAppWelcome" />
        </div>
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.app-welcome-dialog {
  display: grid;
  gap: 12px;
}

.app-welcome-dialog:focus {
  outline: none;
}

.app-welcome-dialog__image {
  display: block;

  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: 8px;

  object-fit: cover;
}

.app-welcome-dialog__content {
  display: grid;
  gap: 8px;
}

.app-welcome-dialog__actions {
  display: flex;
  justify-content: center;
}
</style>
