<script setup lang="ts">
import { NmorphButton, NmorphText, NmorphCard, NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'

import { ChatRoomContextMenu } from 'src/features/chat-room-context-menu'
import { ChatRoomTypingStatus } from 'src/features/chat-room-typing'
import { ContentNavigationBackButton } from 'src/features/content-navigation-back-button'
import { ROOM_CALL_SESSION_I18N, RoomCallMediaButtons } from 'src/features/room-call-session'
import { UserActivityStatus } from 'src/features/user-activity-status'
import { AppProfileBasicData } from 'src/shared/ui'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomHeaderEmits, ChatRoomHeaderProps } from '../config/types'
import { useChatRoomHeader } from '../model/use-chat-room-header.model'

const props = defineProps<ChatRoomHeaderProps>()
const emit = defineEmits<ChatRoomHeaderEmits>()
const {
  avatarIcon,
  avatarIconColor,
  avatarIconSize,
  canCloseSupportChat,
  closeSupportChat,
  interlocutor,
  isClosingSupportChat,
  isFavoritesRoom,
  isSupportRoom,
  isPortraitTabletOrLess,
  membersQuantityText,
  supportStatusText,
  updateChatRoomContentView,
  title
} = useChatRoomHeader(props, emit)
</script>
<template>
  <div class="chat-room-header" :class="{ 'chat-room-header--with-back': isPortraitTabletOrLess }">
    <ContentNavigationBackButton v-if="isPortraitTabletOrLess" class="chat-room-header__back" />
    <NmorphCard
      tag="header"
      shadow-type="inset"
      class="chat-room-content-header"
      content-class="chat-room-content-header__content"
    >
      <AppProfileBasicData
        :image-id="props.room.avatarId"
        :avatar-icon="avatarIcon"
        :avatar-icon-color="avatarIconColor"
        :avatar-icon-size="avatarIconSize"
        :title="title"
        :name="title"
        :selectable="false"
        class="chat-room-content-header__profile"
      >
        <template #description>
          <NmorphText
            v-if="!props.isPrivateRoom && props.joinableRoomCall"
            as="small"
            color="accent"
            variant="body-small"
            >{{ $t(ROOM_CALL_SESSION_I18N.activeRoomCall) }}</NmorphText
          >
          <ChatRoomTypingStatus v-else :room-id="props.room.id">
            <UserActivityStatus
              v-if="props.isPrivateRoom && interlocutor"
              :online="interlocutor.online"
              :last-seen="interlocutor.lastSeen"
            />
            <NmorphText v-else-if="isSupportRoom" as="small" color="semi-contrast" variant="body-small">{{
              supportStatusText
            }}</NmorphText>
            <NmorphText
              v-else-if="!props.isPrivateRoom && !isFavoritesRoom"
              as="small"
              color="semi-contrast"
              variant="body-small"
              >{{ membersQuantityText }}</NmorphText
            >
          </ChatRoomTypingStatus>
        </template>
      </AppProfileBasicData>
      <div class="chat-room-content-header__actions">
        <NmorphSelectButton
          v-if="props.hasRoomCall && props.isRoomCallAvailable"
          thickness="thick"
          :model-value="props.contentView"
          :aria-label="$t(CHAT_ROOM_CONTENT_I18N.selectChatRoomContentView)"
          @update:model-value="updateChatRoomContentView"
        >
          <NmorphSelectButtonItem :value="'text'">
            {{ $t(CHAT_ROOM_CONTENT_I18N.textChatView) }}
          </NmorphSelectButtonItem>
          <NmorphSelectButtonItem :value="'call'">
            {{ $t(CHAT_ROOM_CONTENT_I18N.roomCallView) }}
          </NmorphSelectButtonItem>
        </NmorphSelectButton>
        <RoomCallMediaButtons
          v-if="props.isRoomCallAvailable && !props.hasRoomCall"
          :disabled="props.isRoomCallStartDisabled"
          :loading="props.isRoomCallStarting"
          :loading-media-kind="props.roomCallLoadingMediaKind"
          @start="emit('start-room-call', $event)"
        />
        <NmorphButton
          v-if="canCloseSupportChat"
          :text="$t(CHAT_ROOM_CONTENT_I18N.closeSupportChat)"
          :loading="isClosingSupportChat"
          @click="closeSupportChat"
        />
        <ChatRoomContextMenu v-if="!isSupportRoom" :item="props.room" />
      </div>
    </NmorphCard>
  </div>
</template>

<style lang="scss">
.chat-room-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  align-items: center;

  height: auto;
}

.chat-room-header--with-back {
  grid-template-columns: max-content minmax(0, 1fr);
}

.chat-room-content-header {
  min-width: 0;
}

.chat-room-content-header__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;

  width: 100%;
}

.chat-room-content-header__profile {
  min-width: 0;
}

.chat-room-content-header__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
