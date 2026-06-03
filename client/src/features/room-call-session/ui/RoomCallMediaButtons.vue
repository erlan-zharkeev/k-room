<script setup lang="ts">
import { NmorphButton, NmorphDivider, NmorphIcon, NmorphIconPhone, NmorphIconVideoCamera } from '@nmorph/nmorph-ui-kit'
import { ROOM_CALL_MEDIA_KIND } from 'global-shared'

import {
  ROOM_CALL_AUDIO_BUTTON_TITLE_BY_ACTION,
  ROOM_CALL_MEDIA_BUTTONS_DEFAULT_PROPS,
  ROOM_CALL_VIDEO_BUTTON_TITLE_BY_ACTION
} from '../config/constants'
import type { RoomCallMediaButtonsEmits, RoomCallMediaButtonsProps } from '../config/types'

const props = withDefaults(defineProps<RoomCallMediaButtonsProps>(), ROOM_CALL_MEDIA_BUTTONS_DEFAULT_PROPS)
const emit = defineEmits<RoomCallMediaButtonsEmits>()
</script>

<template>
  <div class="room-call-media-buttons">
    <NmorphButton
      shape="square"
      style-type="transparent"
      :aria-label="$t(ROOM_CALL_AUDIO_BUTTON_TITLE_BY_ACTION[props.action])"
      :title="$t(ROOM_CALL_AUDIO_BUTTON_TITLE_BY_ACTION[props.action])"
      :disabled="props.disabled"
      :loading="props.loading"
      @click="emit('start', ROOM_CALL_MEDIA_KIND.AUDIO)"
    >
      <NmorphIcon width="16px" height="16px">
        <NmorphIconPhone />
      </NmorphIcon>
    </NmorphButton>

    <NmorphButton
      shape="square"
      style-type="transparent"
      :aria-label="$t(ROOM_CALL_VIDEO_BUTTON_TITLE_BY_ACTION[props.action])"
      :title="$t(ROOM_CALL_VIDEO_BUTTON_TITLE_BY_ACTION[props.action])"
      :disabled="props.disabled"
      :loading="props.loading"
      @click="emit('start', ROOM_CALL_MEDIA_KIND.VIDEO)"
    >
      <NmorphIcon width="16px" height="16px">
        <NmorphIconVideoCamera />
      </NmorphIcon>
    </NmorphButton>

    <NmorphDivider direction="vertical" />
  </div>
</template>

<style lang="scss">
.room-call-media-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
