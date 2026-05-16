<script setup lang="ts">
import { NmorphIcon, NmorphIconChatLineSquare } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/constants'
</script>

<template>
  <div class="chat-room-stub">
    <NmorphIcon size="large">
      <NmorphIconChatLineSquare />
    </NmorphIcon>
    <AppText alignment="center" :selectable="false" :text="$t(CHAT_ROOM_PAGE_I18N.noRoomSelected)" />
  </div>
</template>

<style lang="scss">
.chat-room-stub {
  @include flex-column-center;
  @include absolute-center;

  gap: 8px;
}
</style>
