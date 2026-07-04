<script setup lang="ts">
import type { RoomCallAudioOutputItemProps } from '../config/types'
import { useRoomCallAudioOutputItem } from '../model/use-room-call-audio-output-item.model'

const props = defineProps<RoomCallAudioOutputItemProps>()

useRoomCallAudioOutputItem(props)
</script>

<template>
  <audio ref="audio" class="room-call-audio-output-item" :muted="props.item.muted" autoplay preload="auto" />
</template>

<style lang="scss" scoped>
.room-call-audio-output-item {
  pointer-events: none;

  position: fixed;
  top: 0;
  left: 0;

  width: 1px;
  height: 1px;

  opacity: 0;
}
</style>
