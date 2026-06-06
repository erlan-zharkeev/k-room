<script setup lang="ts">
import { NmorphButton, NmorphDivider, NmorphIcon, NmorphIconPhone, NmorphIconVideoCamera } from '@nmorph/nmorph-ui-kit'
import { ROOM_CALL_MEDIA_KIND } from 'global-shared'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { RoomCallMediaButtonsEmits, RoomCallMediaButtonsProps } from '../config/types'

const props = defineProps<RoomCallMediaButtonsProps>()
const emit = defineEmits<RoomCallMediaButtonsEmits>()
</script>

<template>
  <div class="room-call-media-buttons">
    <NmorphButton
      shape="square"
      design="plain"
      borderless
      :aria-label="$t(ROOM_CALL_SESSION_I18N.startAudioRoomCall)"
      :disabled="props.disabled || props.loading"
      :loading="props.loadingMediaKind === ROOM_CALL_MEDIA_KIND.AUDIO"
      @click="emit('start', ROOM_CALL_MEDIA_KIND.AUDIO)"
    >
      <NmorphIcon width="16px" height="16px">
        <NmorphIconPhone />
      </NmorphIcon>
    </NmorphButton>

    <NmorphButton
      shape="square"
      design="plain"
      borderless
      :aria-label="$t(ROOM_CALL_SESSION_I18N.startVideoRoomCall)"
      :disabled="props.disabled || props.loading"
      :loading="props.loadingMediaKind === ROOM_CALL_MEDIA_KIND.VIDEO"
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
