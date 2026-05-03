<script setup lang="ts">
import { NmorphIcon, NmorphIconArrowRight, NmorphIconArrowDown } from '@nmorph/nmorph-ui-kit'
import { Button } from 'primevue'
import { RouterLink } from 'vue-router'

import { AppHeader } from '../AppHeader'
import { AppText } from '../AppText'

import type { IAppContentNavElProps } from './types'

const props = defineProps<IAppContentNavElProps>()
</script>

<template>
  <div :class="['app-content-nav-el', props.active ? 'nmorph--shadow-inset' : 'nmorph--shadow-outset']">
    <RouterLink :to="props.to" custom v-slot="{ href, navigate }">
      <Button
        as="a"
        :href="href"
        :pt="{
          root: {
            class: ['app-content-nav-el-btn', { 'app-content-nav-el-btn--active': props.active }]
          }
        }"
        :aria-current="props.active ? 'page' : undefined"
        :aria-label="props.ariaLabel"
        severity="secondary"
        @click="navigate"
      >
        <div class="app-content-nav-el__text">
          <AppHeader tag="h5" truncate :text="props.label" />
          <AppText tag="small" truncate color="semi-contrast-color" :text="props.description" />
        </div>
        <NmorphIcon>
          <NmorphIconArrowRight v-if="props.active" />
          <NmorphIconArrowDown v-else/>
        </NmorphIcon>
      </Button>
    </RouterLink>
  </div>
</template>

<style lang="scss">
.app-content-nav-el {
  .app-content-nav-el-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    padding: 12px;
  }

  .app-content-nav-el__text {
    display: grid;
  }

  @include screen-tablet-up {
    .app-content-nav-el-btn.p-button-secondary:not(:disabled):hover {
      background: var(--app-hover-background);
    }

    .app-content-nav-el-btn.app-content-nav-el-btn--active {
      background: var(--app-hover-background);
    }

    .app-content-nav-el-btn.app-content-nav-el-btn--active:not(:disabled):hover {
      background: var(--app-hover-background);
    }
  }
}
</style>
