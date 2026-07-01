<script setup lang="ts">
import { NmorphText, NmorphButton } from '@nmorph/nmorph-ui-kit'

import { AppDialog } from 'src/shared/ui'

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
  <AppDialog
    :model-value="isAppWelcomeVisible"
    :show-close="false"
    variant="default"
    close-on-overlay
    @update:model-value="updateAppWelcomeVisible"
  >
    <div class="app-welcome-dialog" :style="dialogContentStyle" tabindex="0">
      <img class="app-welcome-dialog__image" :src="welcomeImageSrc" :alt="$t(APP_WELCOME_I18N.imageAlt)" />
      <div class="app-welcome-dialog__content">
        <NmorphText as="h3" align="center" variant="title" weight="bold">{{ $t(APP_WELCOME_I18N.title) }}</NmorphText>
        <NmorphText as="p" align="center" color="semi-contrast">{{ $t(APP_WELCOME_I18N.description) }}</NmorphText>
        <div class="app-welcome-dialog__actions">
          <NmorphButton design="plain" borderless :text="$t(APP_WELCOME_I18N.action)" @click="completeAppWelcome" />
        </div>
      </div>
    </div>
  </AppDialog>
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
