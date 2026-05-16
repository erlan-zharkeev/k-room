<script setup lang="ts">
import {
  NmorphButton,
  NmorphCheckbox,
  NmorphDialog,
  NmorphIconPlusThin,
  NmorphIconSearch,
  NmorphScroll,
  NmorphTextInput,
  NmorphCard
} from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import { CHAT_ROOM_PAGE_I18N } from '../config/i18n'
import { useChatRoomsNavigation } from '../model/use-chat-rooms-navigation.model'

import ChatRoomList from './ChatRoomList.vue'

const {
  searchQuery,
  contactSearchQuery,
  createChatName,
  isCreateChatDialogOpen,
  isCreatingChat,
  selectedContactIds,
  chatRoomList,
  contactPickerList,
  acceptedContacts,
  isPrivateChatAlreadyExists,
  isGroupChat,
  canCreateChat,
  showNoSearchResults,
  showNoChats,
  openCreateChatDialog,
  closeCreateChatDialog,
  toggleContactSelection,
  createChatRoom
} = useChatRoomsNavigation()
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

    <AppText
      v-if="showNoChats"
      alignment="center"
      :selectable="false"
      :text="$t(CHAT_ROOM_PAGE_I18N.noChats)"
    />
    <AppText
      v-else-if="showNoSearchResults"
      color="semi-contrast-text"
      :selectable="false"
      :text="$t(CHAT_ROOM_PAGE_I18N.noSearchResults)"
    />
    <NmorphScroll v-else scroll-x-prop="hidden" class="chat-rooms-navigation__scroll">
      <ChatRoomList :items="chatRoomList" />
    </NmorphScroll>

    <NmorphDialog
      :model-value="isCreateChatDialogOpen"
      :title="$t(CHAT_ROOM_PAGE_I18N.createChatTitle)"
      @update:model-value="($event) => ($event ? openCreateChatDialog() : closeCreateChatDialog())"
    >
      <div class="create-chat-room-dialog">
        <NmorphTextInput
          v-if="isGroupChat"
          v-model.trim="createChatName"
          :placeholder="$t(CHAT_ROOM_PAGE_I18N.chatName)"
          :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.chatName) }"
        />
        <NmorphTextInput
          v-model="contactSearchQuery"
          clearable
          :placeholder="$t(CHAT_ROOM_PAGE_I18N.contactSearch)"
          :input-attrs="{ 'aria-label': $t(CHAT_ROOM_PAGE_I18N.contactSearch) }"
        >
          <template #prepend-icon>
            <NmorphIconSearch />
          </template>
        </NmorphTextInput>
        <div class="create-chat-room-dialog__meta">
          <AppText
            tag="small"
            color="semi-contrast-text"
            :selectable="false"
            :text="$t(CHAT_ROOM_PAGE_I18N.contacts)"
          />
          <AppText
            tag="small"
            color="semi-contrast-text"
            :selectable="false"
            :text="`${$t(CHAT_ROOM_PAGE_I18N.selectedContacts)}: ${selectedContactIds.length}`"
          />
        </div>
        <AppText
          v-if="isPrivateChatAlreadyExists"
          color="warn"
          :selectable="false"
          :text="$t(CHAT_ROOM_PAGE_I18N.privateChatExists)"
        />
        <AppText
          v-if="!acceptedContacts.length"
          color="semi-contrast-text"
          :selectable="false"
          :text="$t(CHAT_ROOM_PAGE_I18N.noContacts)"
        />
        <NmorphScroll v-else scroll-x-prop="hidden" class="create-chat-room-dialog__contacts">
          <div class="create-chat-room-dialog__contact-list">
            <NmorphCard
              shadow-type="inset"
              tag="label"
              v-for="contact in contactPickerList"
              :key="contact.id"
              class="create-chat-room-dialog__contact"
            >
              <AppProfileBasicData
                class="create-chat-room-dialog__profile"
                :image-id="contact.imageId"
                :title="contact.title"
                :name="contact.title"
                :selectable="false"
              />
              <NmorphCheckbox
                :model-value="contact.selected"
                @update:model-value="toggleContactSelection(contact.id, $event)"
              />
            </NmorphCard>
          </div>
        </NmorphScroll>
        <div class="create-chat-room-dialog__actions">
          <NmorphButton
            style-type="transparent"
            :text="$t(CHAT_ROOM_PAGE_I18N.cancel)"
            :disabled="isCreatingChat"
            @click="closeCreateChatDialog"
          />
          <NmorphButton
            :text="$t(CHAT_ROOM_PAGE_I18N.createChat)"
            :loading="isCreatingChat"
            :disabled="!canCreateChat"
            @click="createChatRoom"
          />
        </div>
      </div>
    </NmorphDialog>
  </section>
</template>

<style lang="scss">
.chat-rooms-navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-rooms-navigation__toolbar {
  display: grid;
  gap: 8px;
}
</style>
