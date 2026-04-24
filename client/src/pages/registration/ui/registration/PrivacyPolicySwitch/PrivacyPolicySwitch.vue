<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { PRIVACY_POLICY_SWITCH_I18N } from '../../../config/privacy-policy-switch-i18n'
import type { IPrivacyPolicySwitchProps } from '../types'

defineProps<IPrivacyPolicySwitchProps>()
</script>

<template>
  <span class="privacy-policy-switch" :class="{ 'privacy-policy-switch--disabled': disabled }">
    {{ $t(PRIVACY_POLICY_SWITCH_I18N.agreement) }}
    <RouterLink :to="ROUTE_NAMES.privacyPolicy">{{ $t(PRIVACY_POLICY_SWITCH_I18N.link) }}</RouterLink>
  </span>
</template>

<style scoped>
.privacy-policy-switch {
  font-size: 0.9rem;
  color: var(--text);
}

.privacy-policy-switch--disabled {
  opacity: 0.7;
}

.privacy-policy-switch a {
  color: var(--accent);
  text-decoration: none;
}

.privacy-policy-switch a:hover {
  text-decoration: underline;
}
</style>
