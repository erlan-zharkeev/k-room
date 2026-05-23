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
      <NmorphCard shadow-type="inset">
        <template #header>
          <AppLogo />
        </template>
        <article>
          <slot>
            <NmorphScroll>
              <div class="page-layout__router-view-wrapper">
                <RouterView />
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
  width: min(420px, 100%);
  min-width: 0;
}

.page-layout__router-view-wrapper {
  padding: 8px;
}
</style>
