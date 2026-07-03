<script setup lang="ts">
import { NmorphCard } from '@nmorph/nmorph-ui-kit'

import { CallActivityPanel } from 'src/features/room-call-session'

import { useChatRoomContent } from '../model/use-chat-room-content.model'

import ChatRoomFooter from './ChatRoomFooter.vue'
import ChatRoomHeader from './ChatRoomHeader.vue'
import ChatRoomMessages from './ChatRoomMessages.vue'
import ChatRoomPinnedMessage from './ChatRoomPinnedMessage.vue'
import ChatRoomStub from './ChatRoomStub.vue'
import RoomCallPanel from './RoomCallPanel.vue'

const {
  selectedChatRoom,
  isRoomCallAvailable,
  isSelectedChatRoomPrivate,
  selectedMessageId,
  chatRoomContentView,
  hasSelectedRoomCall,
  isChatRoomTextView,
  selectedActiveRoomCall,
  joinableSelectedRoomCall,
  audioStream,
  videoStream,
  screenStream,
  connectionQualityByUserId,
  remoteStreamsByUserId,
  handRaisedByUserId,
  temporaryQuickCommandByUserId,
  localMediaState,
  isRoomCallStartDisabled,
  isStartingRoomCall,
  isLeavingRoomCall,
  isRoomCallSessionBusy,
  roomCallLoadingMediaKind,
  clearSelectedMessage,
  changeChatRoomContentView,
  sendActiveRoomCallQuickCommand,
  setActiveRoomCallAudioEnabled,
  setActiveRoomCallHandRaised,
  setActiveRoomCallVideoEnabled,
  startActiveRoomCallScreen,
  stopActiveRoomCallScreen,
  leaveActiveRoomCall,
  selectChatRoomMessage,
  selectCurrentChatRoomMessage,
  startSelectedRoomCall
} = useChatRoomContent()
</script>

<template>
  <section class="chat-room-page">
    <ChatRoomHeader
      v-if="selectedChatRoom"
      :room="selectedChatRoom"
      :is-private-room="isSelectedChatRoomPrivate"
      :has-room-call="hasSelectedRoomCall"
      :content-view="chatRoomContentView"
      :joinable-room-call="joinableSelectedRoomCall"
      :is-room-call-available="isRoomCallAvailable"
      :is-room-call-start-disabled="isRoomCallStartDisabled"
      :is-room-call-starting="isStartingRoomCall"
      :room-call-loading-media-kind="roomCallLoadingMediaKind"
      @update-content-view="changeChatRoomContentView"
      @start-room-call="startSelectedRoomCall"
    />
    <template v-if="selectedChatRoom">
      <template v-if="isChatRoomTextView">
        <ChatRoomPinnedMessage :room="selectedChatRoom" @select="selectCurrentChatRoomMessage" />
        <NmorphCard shadow-type="inset" class="chat-room-page__messages">
          <ChatRoomMessages
            :key="selectedChatRoom.id"
            :room="selectedChatRoom"
            :is-private-room="isSelectedChatRoomPrivate"
            :target-message-id="selectedMessageId"
            @select-message="selectChatRoomMessage"
            @target-message-scrolled="clearSelectedMessage"
          />
        </NmorphCard>
        <ChatRoomFooter :room="selectedChatRoom" @select-editing-message="selectCurrentChatRoomMessage" />
      </template>
      <NmorphCard v-else shadow-type="inset" class="chat-room-page__call" content-class="chat-room-page__call-content">
        <RoomCallPanel
          v-if="selectedActiveRoomCall"
          :room-call="selectedActiveRoomCall"
          :audio-stream="audioStream"
          :video-stream="videoStream"
          :screen-stream="screenStream"
          :connection-quality-by-user-id="connectionQualityByUserId"
          :remote-streams-by-user-id="remoteStreamsByUserId"
          :hand-raised-by-user-id="handRaisedByUserId"
          :temporary-quick-command-by-user-id="temporaryQuickCommandByUserId"
          :local-media-state="localMediaState"
          :is-busy="isRoomCallSessionBusy"
          :is-leaving="isLeavingRoomCall"
          @set-audio-enabled="setActiveRoomCallAudioEnabled"
          @set-video-enabled="setActiveRoomCallVideoEnabled"
          @send-quick-command="sendActiveRoomCallQuickCommand"
          @set-hand-raised="setActiveRoomCallHandRaised"
          @start-screen="startActiveRoomCallScreen"
          @stop-screen="stopActiveRoomCallScreen"
          @leave="leaveActiveRoomCall"
        />
        <CallActivityPanel
          v-else-if="joinableSelectedRoomCall"
          :compact="false"
          :openable="false"
          :room-id="selectedChatRoom.id"
        />
      </NmorphCard>
    </template>
    <NmorphCard v-else shadow-type="inset" class="chat-room-page__stub">
      <ChatRoomStub />
    </NmorphCard>
  </section>
</template>

<style lang="scss" scoped>
.chat-room-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-room-page__messages,
.chat-room-page__call,
.chat-room-page__stub {
  flex: 1 1 auto;
  min-height: 0;
}

.chat-room-page__messages {
  overflow: hidden;
}

.chat-room-page__call :deep(.chat-room-page__call-content) {
  height: 100%;
  min-height: 0;
}
</style>
