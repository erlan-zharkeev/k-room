<script setup lang="ts">
import type { RoomCallAudioOutputItemProps } from '../config/types'
import { useRoomCallAudioOutputItem } from '../model/use-room-call-audio-output-item.model'

const props = defineProps<RoomCallAudioOutputItemProps>()

useRoomCallAudioOutputItem(props)
</script>

<template>
  <audio ref="audio" class="room-call-audio-output-item" :muted="props.item.muted" autoplay hidden preload="auto" />
</template>
