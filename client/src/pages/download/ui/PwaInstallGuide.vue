<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import { DOWNLOAD_PAGE_I18N } from '../config/i18n'

const props = defineProps<{
  platform: 'android' | 'ios'
}>()
</script>

<template>
  <div class="pwa-install-guide" :class="{ 'pwa-install-guide--ios': props.platform === 'ios' }" aria-hidden="true">
    <div class="pwa-install-guide__step">
      <span class="pwa-install-guide__icon">
        <span
          class="pwa-install-guide__svg"
          :class="
            props.platform === 'android' ? 'pwa-install-guide__svg--android-menu' : 'pwa-install-guide__svg--ios-more'
          "
        />
      </span>
      <NmorphText as="span" align="center" variant="body-small">
        {{ $t(props.platform === 'android' ? DOWNLOAD_PAGE_I18N.pwaStepMenu : DOWNLOAD_PAGE_I18N.pwaStepMore) }}
      </NmorphText>
    </div>

    <span class="pwa-install-guide__arrow">
      <span class="pwa-install-guide__arrow-svg" />
    </span>

    <div class="pwa-install-guide__step">
      <span class="pwa-install-guide__icon">
        <span
          class="pwa-install-guide__svg"
          :class="
            props.platform === 'android'
              ? 'pwa-install-guide__svg--android-install'
              : 'pwa-install-guide__svg--ios-share'
          "
        />
      </span>
      <NmorphText as="span" align="center" variant="body-small">
        {{ $t(props.platform === 'android' ? DOWNLOAD_PAGE_I18N.pwaStepInstall : DOWNLOAD_PAGE_I18N.pwaStepShare) }}
      </NmorphText>
    </div>

    <span class="pwa-install-guide__arrow">
      <span class="pwa-install-guide__arrow-svg" />
    </span>

    <div class="pwa-install-guide__step">
      <span class="pwa-install-guide__icon">
        <span
          class="pwa-install-guide__svg"
          :class="
            props.platform === 'android' ? 'pwa-install-guide__svg--confirm' : 'pwa-install-guide__svg--ios-home-screen'
          "
        />
      </span>
      <NmorphText as="span" align="center" variant="body-small">
        {{
          $t(props.platform === 'android' ? DOWNLOAD_PAGE_I18N.pwaStepConfirm : DOWNLOAD_PAGE_I18N.pwaStepHomeScreen)
        }}
      </NmorphText>
    </div>

    <template v-if="props.platform === 'ios'">
      <span class="pwa-install-guide__arrow">
        <span class="pwa-install-guide__arrow-svg" />
      </span>

      <div class="pwa-install-guide__step">
        <span class="pwa-install-guide__icon">
          <span class="pwa-install-guide__svg pwa-install-guide__svg--confirm" />
        </span>
        <NmorphText as="span" align="center" variant="body-small">
          {{ $t(DOWNLOAD_PAGE_I18N.pwaStepAdd) }}
        </NmorphText>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.pwa-install-guide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr) 16px minmax(0, 1fr);
  gap: 4px;
  align-items: start;

  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--nmorph-accent-color), transparent 78%);
  border-radius: 12px;

  background: color-mix(in srgb, var(--nmorph-accent-color), transparent 92%);
}

.pwa-install-guide--ios {
  grid-template-columns: minmax(0, 1fr) 12px minmax(0, 1fr) 12px minmax(0, 1fr) 12px minmax(0, 1fr);
  gap: 2px;
}

.pwa-install-guide__step {
  display: grid;
  gap: 6px;
  justify-items: center;
  min-width: 0;
}

.pwa-install-guide__icon {
  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;
  border-radius: 12px;

  color: var(--nmorph-accent-color);

  background: color-mix(in srgb, var(--nmorph-accent-color), transparent 84%);
}

.pwa-install-guide__svg {
  display: block;

  width: 24px;
  height: 24px;

  background-color: currentcolor;

  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

.pwa-install-guide__svg--android-menu {
  mask-image: url('../assets/android-menu.svg');
}

.pwa-install-guide__svg--ios-more {
  mask-image: url('../assets/ios-more.svg');
}

.pwa-install-guide__svg--android-install {
  mask-image: url('../assets/android-install.svg');
}

.pwa-install-guide__svg--ios-share {
  mask-image: url('../assets/ios-share.svg');
}

.pwa-install-guide__svg--confirm {
  mask-image: url('../assets/confirm.svg');
}

.pwa-install-guide__svg--ios-home-screen {
  mask-image: url('../assets/ios-home-screen.svg');
}

.pwa-install-guide__arrow {
  display: grid;
  place-items: center;
  height: 44px;
  color: var(--nmorph-placeholder-text-color);
}

.pwa-install-guide__arrow-svg {
  display: block;

  width: 14px;
  height: 14px;

  background-color: currentcolor;

  mask: url('../assets/arrow-right.svg') center / contain no-repeat;
}
</style>
