<script setup lang="ts">
import { NmorphIcon, NmorphIconPhone } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import type { RoomCallAudioContextMenuItemEmits, RoomCallAudioContextMenuItemProps } from '../config/types'
import { useRoomCallAudioContextMenuItem } from '../model/use-room-call-audio-context-menu-item.model'

const props = defineProps<RoomCallAudioContextMenuItemProps>()
const emit = defineEmits<RoomCallAudioContextMenuItemEmits>()
const { isRoomCallAudioContextMenuItemDisabled, startAudioRoomCall } = useRoomCallAudioContextMenuItem(props, emit)
</script>

<template>
  <button
    class="room-call-audio-context-menu-item"
    type="button"
    :aria-disabled="isRoomCallAudioContextMenuItemDisabled"
    @click.stop="startAudioRoomCall"
  >
    <AppText :selectable="false" :text="$t(ROOM_CALL_SESSION_I18N.startAudioRoomCall)" />
  </button>
</template>

<style lang="scss">
.room-call-audio-context-menu-item {
  padding: 0;
  font: inherit;
}

.room-call-audio-context-menu-item[aria-disabled='true'] {
  @include disabled-state;
}
</style>
