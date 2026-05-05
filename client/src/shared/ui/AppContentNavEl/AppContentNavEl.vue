<script setup lang="ts">
import { NmorphIcon, NmorphIconArrowRight, NmorphIconArrowDown } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useScreen } from 'src/shared/lib'

import { AppHeader } from '../AppHeader'
import { AppText } from '../AppText'

import type { IAppContentNavElProps } from './types'

const props = defineProps<IAppContentNavElProps>()
const { isMobile } = useScreen()

const modifierClass = computed(() => {
  return props.active && !isMobile.value ? 'nmorph--shadow-inset' : 'nmorph--shadow-outset'
})
</script>

<template>
  <div :class="['app-content-nav-el', modifierClass]">
    <RouterLink
      :to="props.to"
      :class="['app-content-nav-el-btn', { 'app-content-nav-el-btn--active': props.active }]"
      :aria-current="props.active ? 'page' : undefined"
      :aria-label="props.ariaLabel"
    >
      <div class="app-content-nav-el__text">
        <AppHeader tag="h5" truncate :text="props.label" />
        <AppText tag="small" truncate color="semi-contrast-color" :text="props.description" />
      </div>
      <div class="app-content-nav-el__icon">
        <NmorphIcon>
          <NmorphIconArrowRight v-if="props.active" />
          <NmorphIconArrowDown v-else />
        </NmorphIcon>
      </div>
    </RouterLink>
  </div>
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
