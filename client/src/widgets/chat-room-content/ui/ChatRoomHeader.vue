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
  hasHeaderPrimaryActions,
  hasRoomCallStartActions,
  hasRoomCallViewSwitch,
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
  <div
    class="chat-room-header"
    :class="{
      'chat-room-header--with-back': isPortraitTabletOrLess,
      'chat-room-header--with-primary-actions': hasHeaderPrimaryActions
    }"
  >
    <ContentNavigationBackButton
      v-if="isPortraitTabletOrLess"
      class="chat-room-header__back chat-room-header__back--outside"
    />
    <NmorphCard
      tag="header"
      shadow-type="inset"
      class="chat-room-content-header"
      content-class="chat-room-content-header__content"
    >
      <ContentNavigationBackButton v-if="isPortraitTabletOrLess" class="chat-room-content-header__back" />
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
        <div v-if="hasHeaderPrimaryActions" class="chat-room-content-header__primary-actions">
          <NmorphSelectButton
            v-if="hasRoomCallViewSwitch"
            class="chat-room-content-header__view-switch"
            thickness="thin"
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
            v-if="hasRoomCallStartActions"
            class="chat-room-content-header__media-buttons"
            :disabled="props.isRoomCallStartDisabled"
            :loading="props.isRoomCallStarting"
            :loading-media-kind="props.roomCallLoadingMediaKind"
            @start="emit('start-room-call', $event)"
          />
          <NmorphButton
            v-if="canCloseSupportChat"
            class="chat-room-content-header__support-close"
            :text="$t(CHAT_ROOM_CONTENT_I18N.closeSupportChat)"
            :loading="isClosingSupportChat"
            @click="closeSupportChat"
          />
        </div>
        <div v-if="!isSupportRoom" class="chat-room-content-header__menu">
          <ChatRoomContextMenu :item="props.room" />
        </div>
      </div>
    </NmorphCard>
  </div>
</template>

<style lang="scss" scoped>
.chat-room-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  align-items: stretch;

  height: auto;
}

.chat-room-header--with-back {
  grid-template-columns: max-content minmax(0, 1fr);
}

.chat-room-header__back.content-navigation-back-button {
  align-self: stretch;
  width: 42px;
  height: auto;
  min-height: 64px;
}

.chat-room-content-header__back.content-navigation-back-button {
  display: none;
}

.chat-room-content-header {
  min-width: 0;
  height: 100%;
}

.chat-room-content-header :deep(.chat-room-content-header__content) {
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
  min-width: 0;
}

.chat-room-content-header__primary-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.chat-room-content-header__menu {
  flex: 0 0 auto;
}

.chat-room-content-header__view-switch,
.chat-room-content-header__media-buttons,
.chat-room-content-header__support-close {
  min-width: 0;
  max-width: 100%;
}

@media (width < 560px) {
  .chat-room-header--with-back {
    grid-template-columns: minmax(0, 1fr);
  }

  .chat-room-header__back--outside.content-navigation-back-button {
    display: none;
  }

  .chat-room-content-header__back.content-navigation-back-button {
    display: flex;
    grid-area: back;
    align-self: stretch;

    width: 42px;
    height: auto;
    min-height: 42px;
  }

  .chat-room-content-header :deep(.chat-room-content-header__content) {
    grid-template-areas: 'back profile actions';
    grid-template-columns: max-content minmax(0, 1fr) max-content;
  }

  .chat-room-content-header__profile {
    grid-area: profile;
  }

  .chat-room-content-header__actions {
    grid-area: actions;
  }

  .chat-room-header--with-primary-actions .chat-room-content-header :deep(.chat-room-content-header__content) {
    grid-template-areas:
      'profile profile menu'
      'back primary-actions primary-actions';
    grid-template-columns: max-content minmax(0, 1fr) max-content;
  }

  .chat-room-header--with-primary-actions .chat-room-content-header__actions {
    display: contents;
  }

  .chat-room-header--with-primary-actions .chat-room-content-header__primary-actions {
    grid-area: primary-actions;
    justify-self: end;
    max-width: 100%;
  }

  .chat-room-header--with-primary-actions .chat-room-content-header__menu {
    grid-area: menu;
    justify-self: end;
  }
}
</style>
