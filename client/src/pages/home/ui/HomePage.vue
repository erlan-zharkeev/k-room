<script setup lang="ts">
import Button from 'primevue/button'

import { APP_TITLE } from 'src/shared/config'
import PageFrame from 'src/shared/ui/page-frame'
</script>

<template>
  <PageFrame>
    <section class="home-page">
      <p class="home-page__eyebrow">Vue migration</p>
      <h1 class="home-page__title">{{ APP_TITLE }} Vue shell is ready.</h1>
      <p class="home-page__text">
        Legacy React client was moved to <code>legacy/legacy-client</code>. This package is now the new Vue entry point
        with a clean FSD structure.
      </p>
      <div class="home-page__actions">
        <Button label="PrimeVue ready" icon="pi pi-check" />
        <Button label="Start migration" icon="pi pi-arrow-right" severity="contrast" outlined />
      </div>
      <div class="home-page__grid">
        <div class="home-page__card">
          <span class="home-page__label">App</span>
          <strong>Bootstrapping, providers, global styles</strong>
        </div>
        <div class="home-page__card">
          <span class="home-page__label">Pages</span>
          <strong>First route-level screen for migration work</strong>
        </div>
        <div class="home-page__card">
          <span class="home-page__label">Shared</span>
          <strong>Reusable shell for upcoming Vue widgets</strong>
        </div>
      </div>
    </section>
  </PageFrame>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: 1.25rem;
}

.home-page__eyebrow {
  margin: 0;

  font-size: 0.8rem;
  color: #7fb2ff;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.home-page__title {
  max-width: 10ch;
  margin: 0;
  font-size: clamp(2.6rem, 8vw, 5rem);
  line-height: 0.94;
}

.home-page__text {
  max-width: 46rem;
  margin: 0;
  font-size: 1rem;
  color: rgb(235 241 250 / 78%);
}

.home-page__text code {
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  font-size: 0.95em;
  background: rgb(255 255 255 / 8%);
}

.home-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.home-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.home-page__card {
  display: grid;
  gap: 0.45rem;

  min-height: 9rem;
  padding: 1.25rem;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 1.25rem;

  background: linear-gradient(180deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 4%));
  box-shadow: 0 20px 60px rgb(0 0 0 / 14%);
}

.home-page__label {
  font-size: 0.76rem;
  color: rgb(127 178 255 / 84%);
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

@media (width <= 840px) {
  .home-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
