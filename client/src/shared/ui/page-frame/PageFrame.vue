<template>
  <main class="page-frame">
    <div class="page-frame__glow page-frame__glow--left"></div>
    <div class="page-frame__glow page-frame__glow--right"></div>
    <div class="page-frame__content">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.page-frame {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.page-frame__content {
  position: relative;
  z-index: 1;

  width: min(100%, 1100px);
  margin: 0 auto;
  padding: clamp(1.25rem, 5vw, 3rem);
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 2rem;

  background: rgb(8 18 31 / 78%);
  backdrop-filter: blur(18px);
}

.page-frame__glow {
  position: absolute;
  inset: auto;

  width: 24rem;
  height: 24rem;
  border-radius: 999px;

  opacity: 0.55;
  filter: blur(42px);
}

.page-frame__glow--left {
  top: -6rem;
  left: -8rem;
  background: rgb(56 132 255 / 25%);
}

.page-frame__glow--right {
  right: -10rem;
  bottom: -8rem;
  background: rgb(0 205 171 / 18%);
}
</style>
