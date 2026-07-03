<script setup lang="ts">
import { useRoomCallAudioOutput } from '../model/use-room-call-audio-output.model'

import RoomCallAudioOutputItem from './RoomCallAudioOutputItem.vue'

const { roomCallAudioOutputItems } = useRoomCallAudioOutput()
</script>

<template>
  <div class="room-call-audio-output" aria-hidden="true">
    <RoomCallAudioOutputItem v-for="item in roomCallAudioOutputItems" :key="item.userId" :item="item" />
  </div>
</template>

<style lang="scss" scoped>
.room-call-audio-output {
  display: contents;
}
</style>
