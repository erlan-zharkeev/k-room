<template>
  <svg class="app-logo-icon" viewBox="0 0 310 310" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="app-logo-icon__petal--medium" d="M156 155.5L30.75 279.775L30.75 31.2254L156 155.5Z" />
    <path class="app-logo-icon__petal--dark" d="M155.5 155L279.775 279.5H31.2254L155.5 155Z" />
    <path class="app-logo-icon__petal--light" d="M155.5 156L31.2253 31.5L279.775 31.5L155.5 156Z" />
  </svg>
</template>

<style lang="scss" scoped>
.app-logo-icon {
  display: block;
  width: 100%;
  height: 100%;
}

.app-logo-icon__petal--dark {
  fill: var(--app-logo-petal-dark, #3b75b1);
}

.app-logo-icon__petal--medium {
  fill: var(--app-logo-petal-medium, #418fde);
}

.app-logo-icon__petal--light {
  fill: var(--app-logo-petal-light, #74b3f3);
}
</style>
