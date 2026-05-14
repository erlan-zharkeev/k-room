<script setup lang="ts">
import { NmorphIconSearch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppHeader, AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import { useContactListSearch } from '../model/use-contact-list-search.model'
import { useContactsPage } from '../model/use-contacts-page.model'

import ContactList from './ContactList.vue'
import ContactsDeleteDialog from './ContactsDeleteDialog.vue'
import ContactsSearch from './ContactsSearch.vue'

const {
  loadingContactIds,
  creatingChatContactIds,
  isDeleteDialogOpen,
  getContactActivity,
  getContactStatus,
  getPersonalChatRoomId,
  addContact,
  updateInteraction,
  goToChatRoom,
  createPrivateChat,
  openDeleteDialog,
  closeDeleteDialog,
  deleteContact
} = useContactsPage()
const { searchQuery, contactList, contactListEmptyText } = useContactListSearch()
</script>

<template>
  <section class="contacts-page">
    <div class="contacts-page__search">
      <NmorphTextInput
        v-model="searchQuery"
        clearable
        :placeholder="$t(CONTACTS_PAGE_I18N.search)"
        :input-attrs="{ 'aria-label': $t(CONTACTS_PAGE_I18N.search) }"
      >
        <template #prepend-icon>
          <NmorphIconSearch />
        </template>
      </NmorphTextInput>
    </div>
    <ContactsSearch class="contacts-page__list" :loading-contact-ids="loadingContactIds" @add="addContact">
      <div class="contacts-page__block">
        <AppHeader tag="h5" :text="$t(CONTACTS_PAGE_I18N.listTitle)" />
        <ContactList
          v-if="contactList.length"
          :contact-list="contactList"
          :creating-chat-contact-ids="creatingChatContactIds"
          :get-contact-activity="getContactActivity"
          :get-contact-status="getContactStatus"
          :get-personal-chat-room-id="getPersonalChatRoomId"
          :loading-contact-ids="loadingContactIds"
          @create-chat="createPrivateChat"
          @delete="openDeleteDialog"
          @go-to-chat="goToChatRoom"
          @update-interaction="updateInteraction"
        />
        <AppText v-else color="semi-contrast-text" :text="$t(contactListEmptyText)" />
      </div>
    </ContactsSearch>
    <ContactsDeleteDialog v-model="isDeleteDialogOpen" @cancel="closeDeleteDialog" @confirm="deleteContact" />
  </section>
</template>

<style lang="scss">
.contacts-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
}

.contacts-page__list {
  flex: 1 1 auto;
  min-height: 0;
}

.contacts-page__block {
  display: grid;
  gap: 8px;
}
</style>
