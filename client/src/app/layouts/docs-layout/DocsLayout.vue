<script setup lang="ts">
import { NmorphCard, NmorphScroll } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import { PageBackButton } from 'src/features/page-back-button'
</script>

<template>
  <section class="docs-layout">
    <PageBackButton />
    <NmorphCard class="docs-layout__card" shadow-type="inset">
      <article>
        <slot>
          <NmorphScroll>
            <RouterView />
          </NmorphScroll>
        </slot>
      </article>
    </NmorphCard>
  </section>
</template>

<style lang="scss">
.docs-layout {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.docs-layout__card {
  overflow-y: auto;
  flex: 1 1 auto;
  margin-top: 8px;
}
</style>
