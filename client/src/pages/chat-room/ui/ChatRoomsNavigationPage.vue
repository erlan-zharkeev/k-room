<script setup lang="ts">
import {
  NmorphButton,
  NmorphIconPlusThin,
  NmorphIconSearch,
  NmorphScroll,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import { useChatRoomsNavigationPage } from '../model/use-chat-rooms-navigation-page.model'

import ChatRoomList from './ChatRoomList.vue'
import CreateChatRoomDialog from './CreateChatRoomDialog.vue'

const {
  searchQuery,
  isCreateChatDialogOpen,
  chatRoomList,
  showNoSearchResults,
  showNoChats,
  openCreateChatDialog,
  openChatRoom
} = useChatRoomsNavigationPage()
</script>

<template>
  <section class="chat-rooms-navigation">
    <div class="chat-rooms-navigation__toolbar">
      <NmorphTextInput
        v-model="searchQuery"
        clearable
        :placeholder="$t(CHAT_ROOM_PAGE_I18N.search)"
        :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.search) }"
      >
        <template #prepend-icon>
          <NmorphIconSearch />
        </template>
      </NmorphTextInput>
      <NmorphButton :aria-label="$t(CHAT_ROOM_PAGE_I18N.createChat)" @click="openCreateChatDialog">
        <template #icon>
          <NmorphIconPlusThin />
        </template>
        <AppText :selectable="false" :text="$t(CHAT_ROOM_PAGE_I18N.createChat)" />
      </NmorphButton>
    </div>

    <AppText v-if="showNoChats" alignment="center" :selectable="false" :text="$t(CHAT_ROOM_PAGE_I18N.noChats)" />
    <AppText
      v-else-if="showNoSearchResults"
      alignment="center"
      :selectable="false"
      :text="$t(CHAT_ROOM_PAGE_I18N.noSearchResults)"
    />
    <NmorphScroll v-else scroll-x-prop="hidden" class="chat-rooms-navigation__scroll">
      <ChatRoomList :items="chatRoomList" />
    </NmorphScroll>

    <CreateChatRoomDialog v-model="isCreateChatDialogOpen" @open-room="openChatRoom" />
  </section>
</template>

<style lang="scss">
.chat-rooms-navigation {
  display: flex;
  flex-direction: column;
}

.chat-rooms-navigation__toolbar {
  display: grid;
  gap: 8px;
  padding: 8px;
}
</style>
