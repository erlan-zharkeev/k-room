<script setup lang="ts">
import { NmorphText, NmorphIcon, NmorphIconChatLineSquare } from '@nmorph/nmorph-ui-kit'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
</script>

<template>
  <div class="chat-room-stub">
    <NmorphIcon size="large">
      <NmorphIconChatLineSquare />
    </NmorphIcon>
    <NmorphText align="center">{{ $t(CHAT_ROOM_CONTENT_I18N.noRoomSelected) }}</NmorphText>
  </div>
</template>

<style lang="scss" scoped>
.chat-room-stub {
  @include flex-column-center;
  @include absolute-center;

  gap: 8px;
}
</style>
