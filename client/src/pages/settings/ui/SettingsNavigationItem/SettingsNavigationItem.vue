<script setup lang="ts">
import { NmorphBadge, NmorphIcon, NmorphCard, NmorphIconArrowRight, NmorphIconArrowDown } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import { AppHeader, AppText } from 'src/shared/ui'

import type { SettingsNavigationItemProps } from './types'
import { useSettingsNavigationItem } from './use-settings-navigation-item.model'

const props = defineProps<SettingsNavigationItemProps>()
const { buttonClass, showIcon } = useSettingsNavigationItem(props)
</script>

<template>
  <NmorphBadge
    class="settings-navigation-item-badge"
    :value="props.hasWarning ? '!' : undefined"
    color="var(--nmorph-warn-color)"
    type="ribbon"
    ribbon-corner="top-right"
  >
    <NmorphCard :shadow-type="props.active && showIcon ? 'inset' : 'outset'" class="settings-navigation-item">
      <RouterLink
        :to="props.to"
        :class="buttonClass"
        :aria-current="props.active ? 'page' : undefined"
        :aria-label="props.ariaLabel"
      >
        <div class="settings-navigation-item__text">
          <AppHeader tag="h5" truncate :selectable="false" :text="props.label" />
          <AppText tag="small" truncate color="semi-contrast-text" :selectable="false" :text="props.description" />
        </div>
        <NmorphIcon v-if="showIcon">
          <NmorphIconArrowRight v-if="props.active" />
          <NmorphIconArrowDown v-else />
        </NmorphIcon>
      </RouterLink>
    </NmorphCard>
  </NmorphBadge>
</template>

<style lang="scss">
.settings-navigation-item-badge.nmorph-badge {
  --nmorph-badge-ribbon-corner-size: 30px;
}

.settings-navigation-item {
  .settings-navigation-item-btn {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    padding: 12px;
  }
}

.settings-navigation-item__text {
  display: grid;
  gap: 6px;
  width: 100%;
  min-width: 0;
}
</style>
