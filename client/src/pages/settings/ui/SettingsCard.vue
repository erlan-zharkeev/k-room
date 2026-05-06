<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'
import { computed, useSlots } from 'vue'

import { AppHeader } from 'src/shared/ui'

import { SETTINGS_CARD_DEFAULT_PROPS } from './settings-card.constants'
import type { ISettingsCardProps } from './settings-card.types'

const props = withDefaults(defineProps<ISettingsCardProps>(), SETTINGS_CARD_DEFAULT_PROPS)

const slots = useSlots()
const hasFooter = computed(() => Boolean(slots.footer || props.buttonLabel))
</script>

<template>
  <div class="settings-card nmorph--shadow-outset">
    <div class="settings-card__title">
      <AppHeader tag="h2" color="contrast-text" :text="title" />
    </div>

    <div class="settings-card__content">
      <slot />
    </div>

    <div v-if="hasFooter" class="settings-card__footer">
      <slot name="footer">
        <NmorphButton
          fill
          :text="props.buttonLabel"
          :disabled="buttonDisabled"
          :loading="buttonLoading"
          @click="props.onButtonClick"
        />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.settings-card {
  display: grid;
  gap: 8px;
  align-content: start;

  padding: 14px;
  border-radius: 8px;
}

.settings-card__content {
  display: grid;
  gap: 8px;
  align-content: start;
}
</style>
