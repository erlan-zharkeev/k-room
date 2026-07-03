<script setup lang="ts">
import { NmorphText, NmorphIconSearch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { CONTACT_SEARCH_QUERY_MAX_LENGTH } from 'global-shared'

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
  isContactActivityVisible,
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
    <NmorphTextInput
      v-model="searchQuery"
      class="contacts-page__search"
      clearable
      :placeholder="$t(CONTACTS_PAGE_I18N.search)"
      :input-attrs="{ maxLength: CONTACT_SEARCH_QUERY_MAX_LENGTH, 'aria-label': $t(CONTACTS_PAGE_I18N.search) }"
    >
      <template #prepend-icon>
        <NmorphIconSearch />
      </template>
    </NmorphTextInput>
    <ContactsSearch class="contacts-page__list" :loading-contact-ids="loadingContactIds" @add="addContact">
      <div class="contacts-page__block">
        <NmorphText as="h5" variant="title-small" weight="bold">{{ $t(CONTACTS_PAGE_I18N.listTitle) }}</NmorphText>
        <ContactList
          v-if="contactList.length"
          :contact-list="contactList"
          :creating-chat-contact-ids="creatingChatContactIds"
          :is-contact-activity-visible="isContactActivityVisible"
          :get-contact-status="getContactStatus"
          :get-personal-chat-room-id="getPersonalChatRoomId"
          :loading-contact-ids="loadingContactIds"
          @create-chat="createPrivateChat"
          @delete="openDeleteDialog"
          @go-to-chat="goToChatRoom"
          @update-interaction="updateInteraction"
        />
        <NmorphText v-else color="semi-contrast">{{ $t(contactListEmptyText) }}</NmorphText>
      </div>
    </ContactsSearch>
    <ContactsDeleteDialog v-model="isDeleteDialogOpen" @cancel="closeDeleteDialog" @confirm="deleteContact" />
  </section>
</template>

<style scoped lang="scss">
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

.contacts-page__search {
  flex: 0 0 auto;
}

.contacts-page__block {
  display: grid;
  gap: 8px;
}
</style>
