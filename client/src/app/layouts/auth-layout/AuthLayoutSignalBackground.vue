<script setup lang="ts">
import { AUTH_LAYOUT_VOICE_WAVE_BAR_ITEMS } from './constants'
import { useAuthLayoutSignalBackground } from './use-auth-layout-signal-background.model'

const { lensGhosts, signalLinks, signalWaves, voiceWaves } = useAuthLayoutSignalBackground()
</script>

<template>
  <div class="auth-layout__signals" aria-hidden="true">
    <span
      v-for="signalLink in signalLinks"
      :key="signalLink.id"
      class="auth-layout__signal-link"
      :style="signalLink.style"
    />
    <span
      v-for="signalWave in signalWaves"
      :key="signalWave.id"
      class="auth-layout__signal-wave"
      :style="signalWave.style"
    />
    <span
      v-for="lensGhost in lensGhosts"
      :key="lensGhost.id"
      class="auth-layout__lens-ghost"
      :style="lensGhost.style"
    />
    <span v-for="voiceWave in voiceWaves" :key="voiceWave.id" class="auth-layout__voice-wave" :style="voiceWave.style">
      <span
        v-for="voiceWaveBar in AUTH_LAYOUT_VOICE_WAVE_BAR_ITEMS"
        :key="voiceWaveBar"
        class="auth-layout__voice-wave-bar"
      />
    </span>
  </div>
</template>

<style lang="scss">
.auth-layout__signals {
  pointer-events: none;

  position: absolute;
  z-index: 0;
  inset: 0;

  overflow: hidden;
}

.auth-layout__signals::before {
  content: '';

  position: absolute;
  inset: 0;

  opacity: 0.28;
  background-image: radial-gradient(
      color-mix(in srgb, var(--nmorph-text-color) 16%, transparent) 0.8px,
      transparent 0.8px
    ),
    radial-gradient(color-mix(in srgb, var(--nmorph-accent-color) 14%, transparent) 0.7px, transparent 0.7px);
  background-position: 0 0, 17px 11px;
  background-size: 19px 19px, 29px 29px;

  animation: auth-layout-signal-noise 7s steps(6) infinite;
}

.auth-layout__signal-wave {
  position: absolute;
  top: var(--auth-layout-signal-top);
  left: var(--auth-layout-signal-left);

  aspect-ratio: 1;
  width: var(--auth-layout-signal-size);
  border: 1px solid color-mix(in srgb, var(--nmorph-accent-color) 52%, transparent);
  border-radius: 50%;

  opacity: 0;
  box-shadow: 0 0 14px color-mix(in srgb, var(--nmorph-accent-color) 18%, transparent),
    inset 0 0 14px color-mix(in srgb, var(--nmorph-accent-color) 10%, transparent);

  animation: auth-layout-signal-wave var(--auth-layout-signal-duration) ease-out infinite;
  animation-delay: var(--auth-layout-signal-delay);
}

.auth-layout__signal-link {
  position: absolute;
  top: var(--auth-layout-signal-top);
  left: var(--auth-layout-signal-left);
  transform: rotate(var(--auth-layout-signal-rotate));

  overflow: hidden;

  width: var(--auth-layout-signal-width);
  height: 3px;

  opacity: 0.28;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--nmorph-accent-color) 64%, transparent),
    transparent
  );
  box-shadow: 0 0 14px color-mix(in srgb, var(--nmorph-accent-color) 26%, transparent);

  animation: auth-layout-signal-link var(--auth-layout-signal-duration) ease-in-out infinite;
  animation-delay: var(--auth-layout-signal-delay);
}

.auth-layout__signal-link::before,
.auth-layout__signal-link::after {
  content: '';

  position: absolute;
  top: 0;
  left: 0;

  width: 36px;
  height: 3px;

  opacity: 0;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--nmorph-accent-color) 96%, white 8%),
    transparent
  );
  box-shadow: 0 0 8px color-mix(in srgb, var(--nmorph-accent-color) 72%, transparent),
    0 0 16px color-mix(in srgb, var(--nmorph-accent-color) 34%, transparent);

  animation: auth-layout-signal-packet calc(var(--auth-layout-signal-duration) * 0.72) ease-in-out infinite;
  animation-delay: var(--auth-layout-signal-delay);
}

.auth-layout__signal-link::after {
  width: 22px;
  animation-delay: calc(var(--auth-layout-signal-delay) - 1.35s);
}

.auth-layout__lens-ghost {
  position: absolute;
  top: var(--auth-layout-lens-ghost-top);
  left: var(--auth-layout-lens-ghost-left);
  transform: translate(-50%, -50%)
    translate(var(--auth-layout-lens-ghost-start-x), var(--auth-layout-lens-ghost-start-y))
    rotate(var(--auth-layout-lens-ghost-start-rotate)) scale(0.9);

  aspect-ratio: 1;
  width: var(--auth-layout-lens-ghost-size);

  opacity: 0;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, #5ce1ff 24%, transparent),
    color-mix(in srgb, var(--nmorph-accent-color) 14%, transparent),
    color-mix(in srgb, #ff4f8b 18%, transparent)
  );
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%);
  box-shadow: 0 0 16px color-mix(in srgb, #5ce1ff 10%, transparent),
    0 0 22px color-mix(in srgb, #ff4f8b 8%, transparent);

  animation: auth-layout-lens-ghost var(--auth-layout-lens-ghost-duration) ease-in-out infinite;
  animation-delay: var(--auth-layout-lens-ghost-delay);
}

.auth-layout__lens-ghost::before {
  content: '';

  position: absolute;
  inset: 3px;

  background: linear-gradient(
      30deg,
      transparent 47%,
      color-mix(in srgb, var(--nmorph-accent-color) 16%, transparent) 48%,
      color-mix(in srgb, var(--nmorph-accent-color) 16%, transparent) 52%,
      transparent 53%
    ),
    linear-gradient(
      150deg,
      transparent 47%,
      color-mix(in srgb, #5ce1ff 12%, transparent) 48%,
      color-mix(in srgb, #5ce1ff 12%, transparent) 52%,
      transparent 53%
    ),
    linear-gradient(
      90deg,
      transparent 47%,
      color-mix(in srgb, #ff4f8b 10%, transparent) 48%,
      color-mix(in srgb, #ff4f8b 10%, transparent) 52%,
      transparent 53%
    ),
    color-mix(in srgb, var(--nmorph-main-color) 82%, transparent);
  background-size: 18px 30px;
  clip-path: inherit;
}

.auth-layout__lens-ghost::after {
  content: '';

  position: absolute;
  inset: 0;

  background: linear-gradient(
    90deg,
    color-mix(in srgb, #5ce1ff 18%, transparent),
    transparent,
    color-mix(in srgb, #ff4f8b 14%, transparent)
  );
  clip-path: inherit;
}

.auth-layout__voice-wave {
  position: absolute;
  top: var(--auth-layout-signal-top);
  left: var(--auth-layout-signal-left);
  transform: translate(-50%, -50%);

  display: flex;
  gap: 4px;
  align-items: center;

  width: var(--auth-layout-signal-width);
  height: 44px;

  opacity: 0;

  animation: auth-layout-voice-wave var(--auth-layout-voice-wave-appear-duration) ease-in-out infinite;
  animation-delay: var(--auth-layout-voice-wave-appear-delay);
}

.auth-layout__voice-wave-bar {
  transform-origin: center;
  transform: scaleY(0.3);

  flex: 1 1 0;

  height: 76%;
  border-radius: 999px;

  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--nmorph-accent-color) 62%, transparent),
    color-mix(in srgb, var(--nmorph-text-color) 24%, transparent)
  );
  box-shadow: 0 0 8px color-mix(in srgb, var(--nmorph-accent-color) 18%, transparent);

  animation: auth-layout-voice-wave-bar var(--auth-layout-voice-wave-bar-duration) ease-in-out infinite;
  animation-delay: var(--auth-layout-voice-wave-bar-delay);
}

.auth-layout__voice-wave-bar:nth-child(2n) {
  height: 92%;
  animation-delay: calc(var(--auth-layout-voice-wave-bar-delay) - 0.18s);
}

.auth-layout__voice-wave-bar:nth-child(3n) {
  height: 58%;
  animation-delay: calc(var(--auth-layout-voice-wave-bar-delay) - 0.34s);
}

.auth-layout__voice-wave-bar:nth-child(4n) {
  height: 100%;
  animation-delay: calc(var(--auth-layout-voice-wave-bar-delay) - 0.52s);
}

@keyframes auth-layout-signal-wave {
  0% {
    transform: translate(-50%, -50%) scale(0.66);
    opacity: 0;
  }

  18% {
    opacity: 0.34;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.22);
    opacity: 0;
  }
}

@keyframes auth-layout-signal-noise {
  0%,
  100% {
    transform: translate(0, 0);
  }

  20% {
    transform: translate(8px, -6px);
  }

  40% {
    transform: translate(-5px, 7px);
  }

  60% {
    transform: translate(6px, 5px);
  }

  80% {
    transform: translate(-7px, -4px);
  }
}

@keyframes auth-layout-signal-link {
  0%,
  100% {
    opacity: 0.14;
  }

  50% {
    opacity: 0.42;
  }
}

@keyframes auth-layout-signal-packet {
  0%,
  28%,
  100% {
    transform: translateX(-40px);
    opacity: 0;
  }

  42%,
  68% {
    opacity: 1;
  }

  82% {
    transform: translateX(var(--auth-layout-signal-width));
    opacity: 0;
  }
}

@keyframes auth-layout-lens-ghost {
  0%,
  100% {
    transform: translate(-50%, -50%)
      translate(var(--auth-layout-lens-ghost-start-x), var(--auth-layout-lens-ghost-start-y))
      rotate(var(--auth-layout-lens-ghost-start-rotate)) scale(0.88);
    opacity: 0;
  }

  24% {
    opacity: 0.18;
  }

  58% {
    transform: translate(-50%, -50%) translate(var(--auth-layout-lens-ghost-end-x), var(--auth-layout-lens-ghost-end-y))
      rotate(var(--auth-layout-lens-ghost-end-rotate)) scale(1);
    opacity: 0.26;
  }

  84% {
    transform: translate(-50%, -50%) translate(var(--auth-layout-lens-ghost-end-x), var(--auth-layout-lens-ghost-end-y))
      rotate(var(--auth-layout-lens-ghost-end-rotate)) scale(0.94);
    opacity: 0.08;
  }
}

@keyframes auth-layout-voice-wave {
  0%,
  12%,
  100% {
    transform: translate(-50%, -50%) scale(0.96);
    opacity: 0;
  }

  24%,
  64% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.42;
  }

  80% {
    transform: translate(-50%, -50%) scale(1.04);
    opacity: 0;
  }
}

@keyframes auth-layout-voice-wave-bar {
  0%,
  100% {
    transform: scaleY(0.24);
  }

  32% {
    transform: scaleY(0.72);
  }

  56% {
    transform: scaleY(0.34);
  }

  78% {
    transform: scaleY(0.58);
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-layout__signals::before,
  .auth-layout__signal-wave,
  .auth-layout__signal-link,
  .auth-layout__signal-link::before,
  .auth-layout__signal-link::after,
  .auth-layout__lens-ghost,
  .auth-layout__voice-wave,
  .auth-layout__voice-wave-bar {
    animation: none;
  }

  .auth-layout__signal-wave {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.26;
  }

  .auth-layout__voice-wave {
    transform: translate(-50%, -50%);
    opacity: 0.28;
  }

  .auth-layout__lens-ghost {
    transform: translate(-50%, -50%) rotate(var(--auth-layout-lens-ghost-start-rotate));
    opacity: 0.12;
  }

  .auth-layout__voice-wave-bar {
    transform: scaleY(0.44);
  }
}
</style>
