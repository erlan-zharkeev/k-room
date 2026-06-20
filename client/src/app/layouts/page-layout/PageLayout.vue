<script setup lang="ts">
import { NmorphCard, NmorphScroll } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import { PageBackButton } from 'src/features/page-back-button'
import { AppLogo } from 'src/shared/ui'
</script>

<template>
  <section class="page-layout">
    <PageBackButton />
    <div class="page-layout__card">
      <NmorphCard shadow-type="inset" padding="16px">
        <template #header>
          <AppLogo />
        </template>
        <article>
          <slot>
            <NmorphScroll>
              <div class="page-layout__router-view-wrapper">
                <RouterView v-slot="{ Component, route }">
                  <Transition name="app-route-motion" mode="out-in">
                    <component :is="Component" :key="route.fullPath" />
                  </Transition>
                </RouterView>
              </div>
            </NmorphScroll>
          </slot>
        </article>
      </NmorphCard>
    </div>
  </section>
</template>

<style lang="scss">
.page-layout {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.page-layout__card {
  overflow-y: auto;
  place-self: center;
  width: min(var(--app-card-basic-width), 100%);
  min-width: 0;
}

.page-layout__router-view-wrapper {
  padding: 8px;
}
</style>
