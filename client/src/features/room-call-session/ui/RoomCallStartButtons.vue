<script setup lang="ts">
import { NmorphButton, NmorphIcon, NmorphDivider } from '@nmorph/nmorph-ui-kit'

import { ROOM_CALL_START_BUTTONS } from '../config/constants'
import type { RoomCallStartButtonsEmits, RoomCallStartButtonsProps } from '../config/types'

const props = defineProps<RoomCallStartButtonsProps>()
const emit = defineEmits<RoomCallStartButtonsEmits>()
</script>

<template>
  <div class="room-call-start-buttons">
    <NmorphButton
      v-for="button in ROOM_CALL_START_BUTTONS"
      :key="button.mediaKind"
      shape="square"
      style-type="transparent"
      :aria-label="$t(button.ariaLabel)"
      :title="$t(button.ariaLabel)"
      :disabled="props.disabled"
      :loading="props.loading"
      @click="emit('start', button.mediaKind)"
    >
      <NmorphIcon width="16px" height="16px">
        <component :is="button.icon" />
      </NmorphIcon>
    </NmorphButton>
    <NmorphDivider direction="vertical" />
  </div>
</template>

<style lang="scss">
.room-call-start-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
