<script setup lang="ts">
import { NmorphIcon, NmorphCard, NmorphIconArrowRight, NmorphIconArrowDown } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import { AppHeader } from '../AppHeader'
import { AppText } from '../AppText'

import type { IAppContentNavElProps } from './types'
import { useAppContentNavEl } from './use-app-content-nav-el.model'

const props = defineProps<IAppContentNavElProps>()
const { buttonClass, showIcon } = useAppContentNavEl(props)
</script>

<template>
  <NmorphCard :shadow-type="props.active && showIcon ? 'inset' : 'outset'" class="app-content-nav-el">
    <RouterLink
      :to="props.to"
      :class="buttonClass"
      :aria-current="props.active ? 'page' : undefined"
      :aria-label="props.ariaLabel"
    >
      <div class="app-content-nav-el__text">
        <AppHeader tag="h5" truncate :text="props.label" />
        <AppText tag="small" truncate color="semi-contrast-text" :text="props.description" />
      </div>
      <div v-if="showIcon" class="app-content-nav-el__icon">
        <NmorphIcon>
          <NmorphIconArrowRight v-if="props.active" />
          <NmorphIconArrowDown v-else />
        </NmorphIcon>
      </div>
    </RouterLink>
  </NmorphCard>
</template>

<style lang="scss">
.app-content-nav-el {
  .app-content-nav-el-btn {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    padding: 12px;
  }
}

.app-content-nav-el__text {
  display: grid;
  gap: 6px;
}
</style>
