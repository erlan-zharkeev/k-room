<script setup lang="ts">
import { NmorphBadge } from '@nmorph/nmorph-ui-kit'

import type { UserActivityStatusProps } from '../config/types'
import { useUserActivityStatus } from '../model/use-user-activity-status.model'

const props = defineProps<UserActivityStatusProps>()
const { color, text } = useUserActivityStatus(props)
</script>

<template>
  <NmorphBadge is-tag size="tiny" :color="color" :value="text" />
</template>
