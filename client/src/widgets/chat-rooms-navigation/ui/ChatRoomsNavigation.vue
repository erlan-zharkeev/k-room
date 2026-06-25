<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphIconPlusThin,
  NmorphIconSearch,
  NmorphScroll,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'

import { ChatRoomFormDialog } from 'src/features/chat-room-context-menu'
import { useScrollContentNavigation } from 'src/features/scroll-content-navigation'

import { CHAT_ROOMS_NAVIGATION_I18N } from '../config/i18n'
import { useChatRoomsNavigation } from '../model/use-chat-rooms-navigation.model'

import ChatRoomList from './ChatRoomList.vue'

const { searchQuery, isCreateChatDialogOpen, showNoSearchResults, showNoChats, openCreateChatDialog, openChatRoom } =
  useChatRoomsNavigation()
const { saveScrollContentNavigationState } = useScrollContentNavigation('chat-rooms')
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
        <NmorphText>{{ $t(CHAT_ROOMS_NAVIGATION_I18N.createChat) }}</NmorphText>
      </NmorphButton>
    </div>

    <NmorphText v-if="showNoChats" align="center">{{ $t(CHAT_ROOMS_NAVIGATION_I18N.noChats) }}</NmorphText>
    <NmorphText v-else-if="showNoSearchResults" align="center">{{
      $t(CHAT_ROOMS_NAVIGATION_I18N.noSearchResults)
    }}</NmorphText>
    <NmorphScroll
      v-else
      ref="scrollContentNavigation"
      scroll-x-prop="hidden"
      css-scroll-behavior="auto"
      update-only-on-scroll-end
      :y-gap-in-px="0"
      @update:model-value="saveScrollContentNavigationState"
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
