<script setup lang="ts">
import {
  NmorphButton,
  NmorphIconPlusThin,
  NmorphIconSearch,
  NmorphScroll,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'

import { ChatRoomFormDialog } from 'src/features/chat-room-context-menu'
import { useContentNavigationScroll } from 'src/features/content-navigation-scroll'
import { AppText } from 'src/shared/ui'

import { CHAT_ROOMS_NAVIGATION_I18N } from '../config/i18n'
import { useChatRoomsNavigation } from '../model/use-chat-rooms-navigation.model'

import ChatRoomList from './ChatRoomList.vue'

const { searchQuery, isCreateChatDialogOpen, showNoSearchResults, showNoChats, openCreateChatDialog, openChatRoom } =
  useChatRoomsNavigation()
const { saveContentNavigationScrollState } = useContentNavigationScroll('chat-rooms')
</script>

<template>
  <section class="chat-rooms-navigation">
    <div class="chat-rooms-navigation__toolbar">
      <NmorphTextInput
        v-model="searchQuery"
        clearable
        :placeholder="$t(CHAT_ROOMS_NAVIGATION_I18N.search)"
        :input-attrs="{ 'aria-label': $t(CHAT_ROOMS_NAVIGATION_I18N.search) }"
      >
        <template #prepend-icon>
          <NmorphIconSearch />
        </template>
      </NmorphTextInput>
      <NmorphButton :aria-label="$t(CHAT_ROOMS_NAVIGATION_I18N.createChat)" @click="openCreateChatDialog">
        <template #icon>
          <NmorphIconPlusThin />
        </template>
        <AppText :selectable="false" :text="$t(CHAT_ROOMS_NAVIGATION_I18N.createChat)" />
      </NmorphButton>
    </div>

    <AppText v-if="showNoChats" alignment="center" :selectable="false" :text="$t(CHAT_ROOMS_NAVIGATION_I18N.noChats)" />
    <AppText
      v-else-if="showNoSearchResults"
      alignment="center"
      :selectable="false"
      :text="$t(CHAT_ROOMS_NAVIGATION_I18N.noSearchResults)"
    />
    <NmorphScroll
      v-else
      ref="contentNavigationScroll"
      scroll-x-prop="hidden"
      css-scroll-behavior="auto"
      update-only-on-scroll-end
      :y-gap-in-px="-6"
      @update:model-value="saveContentNavigationScrollState"
    >
      <ChatRoomList />
    </NmorphScroll>

    <ChatRoomFormDialog v-model="isCreateChatDialogOpen" @open-room="openChatRoom" />
  </section>
</template>

<style lang="scss">
.chat-rooms-navigation {
  display: flex;
  flex-direction: column;
}

.chat-rooms-navigation__toolbar {
  display: grid;
  gap: 12px;
  padding: 8px;
}
</style>
