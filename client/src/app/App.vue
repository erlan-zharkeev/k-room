<template>
  <main class="app-shell">
    <section class="app-shell__content">
      <h1 class="app-shell__title">Hello world</h1>
    </section>
  </main>
</template>

<style scoped>
.app-shell {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
}

.app-shell__content {
  padding: 32px 40px;
  border: 1px solid var(--dark-gray-transparent-2);
  border-radius: 24px;

  background: var(--surface-card);
  box-shadow: 16px 16px 36px var(--shadow-outset-start), -16px -16px 36px var(--shadow-outset-end);
}

.app-shell__title {
  margin: 0;

  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1;
  color: var(--contrast-text);
  letter-spacing: -0.04em;
}
</style>
