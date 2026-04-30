<script setup lang="ts">
import { Button } from 'primevue'
import { computed, useSlots } from 'vue'

import { AppHeader } from 'src/shared/ui'

import { SETTINGS_CARD_DEFAULT_PROPS } from './settings-card.constants'
import type { ISettingsCardProps } from './settings-card.types'

const props = withDefaults(defineProps<ISettingsCardProps>(), SETTINGS_CARD_DEFAULT_PROPS)

const slots = useSlots()
const hasFooter = computed(() => Boolean(slots.footer || props.buttonLabel))

const handleButtonClick = () => {
  props.onButtonClick?.()
}
</script>

<template>
  <div class="settings-card">
    <div class="settings-card__title">
      <AppHeader tag="h2" color="contrast-color" :text="title" />
    </div>

    <div class="settings-card__content">
      <slot />
    </div>

    <div v-if="hasFooter" class="settings-card__footer">
      <slot name="footer">
        <Button
          :aria-label="buttonAriaLabel || buttonLabel"
          :disabled="buttonDisabled"
          :label="buttonLabel"
          :loading="buttonLoading"
          class="settings-card__button"
          size="small"
          type="button"
          @click="handleButtonClick"
        />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.settings-card {
  display: grid;
  gap: 14px;
  align-content: start;

  padding: 14px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-app-muted-background);
}

.settings-card__content {
  display: grid;
  gap: 14px;
  align-content: start;
}

.settings-card__footer {
  justify-self: start;
}

@include screen-mobile {
  .settings-card__footer {
    justify-self: stretch;
    width: 100%;
  }

  .settings-card__button {
    width: 100%;
  }
}
</style>
