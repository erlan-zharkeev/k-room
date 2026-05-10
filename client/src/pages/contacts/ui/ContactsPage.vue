<script setup lang="ts">
import { NmorphButton, NmorphDialog, NmorphIconSearch, NmorphTextInput } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { AppHeader, AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import { useContactsPage } from '../model/use-contacts-page.model'

import ContactList from './ContactList.vue'
import ContactsSearch from './ContactsSearch.vue'

const {
  searchQuery,
  hasSearchQuery,
  contactList,
  loadingContactIds,
  creatingChatContactIds,
  isDeleteDialogOpen,
  isExist,
  getContactDescription,
  getPersonalChatRoomId,
  addContact,
  updateInteraction,
  goToChatRoom,
  createPrivateChat,
  openDeleteDialog,
  closeDeleteDialog,
  deleteContact
} = useContactsPage()

const contactListEmptyText = computed(() =>
  hasSearchQuery.value ? CONTACTS_PAGE_I18N.searchEmpty : CONTACTS_PAGE_I18N.listEmpty
)
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
    <ContactsSearch
      class="contacts-page__list"
      :search-query="searchQuery"
      :loading-contact-ids="loadingContactIds"
      :is-contact-exist="isExist"
      @add="addContact"
    >
      <div class="contacts-page__block">
        <AppHeader tag="h5" :text="$t(CONTACTS_PAGE_I18N.listTitle)" />
        <AppText v-if="!contactList.length" color="semi-contrast-text" :text="$t(contactListEmptyText)" />
        <ContactList
          v-else
          :contact-list="contactList"
          :creating-chat-contact-ids="creatingChatContactIds"
          :get-contact-description="getContactDescription"
          :get-personal-chat-room-id="getPersonalChatRoomId"
          :loading-contact-ids="loadingContactIds"
          @create-chat="createPrivateChat"
          @delete="openDeleteDialog"
          @go-to-chat="goToChatRoom"
          @update-interaction="updateInteraction"
        />
      </div>
    </ContactsSearch>
    <NmorphDialog v-model="isDeleteDialogOpen" :title="$t(CONTACTS_PAGE_I18N.deleteTitle)">
      <div class="contacts-page__delete-dialog">
        <AppText :text="$t(CONTACTS_PAGE_I18N.deleteConfirm)" />
        <div class="contacts-page__delete-actions">
          <NmorphButton :text="$t(CONTACTS_PAGE_I18N.cancel)" style-type="transparent" @click="closeDeleteDialog" />
          <NmorphButton
            color="var(--nmorph-error-text-color)"
            :text="$t(CONTACTS_PAGE_I18N.delete)"
            @click="deleteContact"
          />
        </div>
      </div>
    </NmorphDialog>
  </section>
</template>

<style lang="scss">
.contacts-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
