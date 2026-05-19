<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { ContentNavigationBackButton } from 'src/features/content-navigation-back-button'
import { useScreen } from 'src/shared/lib'

import { useChatRoomPage } from '../model/use-chat-room-page.model'

import ChatRoomFooter from './ChatRoomFooter.vue'
import ChatRoomHeader from './ChatRoomHeader.vue'
import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomStub from './ChatRoomStub.vue'

const { isPortraitTabletOrLess } = useScreen()
const { selectedChatRoom, selectedChatRoomIsPrivate } = useChatRoomPage()
</script>

<template>
  <section class="chat-room-page">
    <div class="chat-room-page__header">
      <ContentNavigationBackButton v-if="isPortraitTabletOrLess" />
      <ChatRoomHeader
        v-if="selectedChatRoom"
        class="chat-room-page__header-body"
        :room="selectedChatRoom"
        :is-private-room="selectedChatRoomIsPrivate"
      />
    </div>
    <template v-if="selectedChatRoom">
      <NmorphCard shadow-type="inset" class="chat-room-page__messages">
        <ChatRoomMessages :room="selectedChatRoom" :is-private-room="selectedChatRoomIsPrivate" />
      </NmorphCard>
      <ChatRoomFooter :room="selectedChatRoom" />
    </template>
    <NmorphCard v-else shadow-type="inset" class="chat-room-page__stub">
      <ChatRoomStub />
    </NmorphCard>
  </section>
</template>

<style lang="scss">
.chat-room-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-room-page__header {
  display: flex;
  gap: 8px;
  align-items: center;

  &:empty {
    display: none;
  }
}

.chat-room-page__messages,
.chat-room-page__stub {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
