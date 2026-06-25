<script setup lang="ts">
import { NmorphText, NmorphBadge, NmorphButton, NmorphCard } from '@nmorph/nmorph-ui-kit'

import { CARD_DEFAULT_PROPS } from '../config/constants/card.constants'
import type { CardProps } from '../config/types/card.types'

import { useSettingsCard } from './use-settings-card.model'

const props = withDefaults(defineProps<CardProps>(), CARD_DEFAULT_PROPS)
const { hasFooter } = useSettingsCard(props)
</script>

<template>
  <NmorphBadge
    class="settings-card-badge"
    :value="props.hasWarning ? '!' : undefined"
    color="var(--nmorph-warn-text-color)"
    type="ribbon"
    ribbon-corner="top-right"
  >
    <NmorphCard class="settings-card" :card-padding="12">
      <div class="settings-card__title">
        <NmorphText as="h5" color="var(--nmorph-contrast-text-color)" variant="title-small" weight="bold">{{
          title
        }}</NmorphText>
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
    </NmorphCard>
  </NmorphBadge>
</template>

<style lang="scss">
.settings-card-badge.nmorph-badge {
  --nmorph-badge-ribbon-corner-size: 30px;

  min-width: 0;
}

.settings-card {
  display: grid;
  gap: 8px;
  align-content: start;

  min-width: 0;
  padding: 14px;
  border-radius: 8px;
}

.settings-card__content {
  display: grid;
  gap: 8px;
  align-content: start;
  min-width: 0;
}

.settings-card__title {
  margin-bottom: 4px;
}

.settings-card__footer {
  min-width: 0;
  margin-top: 4px;
}
</style>
