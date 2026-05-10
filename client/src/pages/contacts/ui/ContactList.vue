<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphIconChatLineSquare, NmorphIconPostCard } from '@nmorph/nmorph-ui-kit'

import { AppHeader, AppProfileBasicData } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactListEmits, IContactListProps } from '../config/types'
import { useContactList } from '../model/use-contact-list.model'

import ContactContextMenu from './ContactContextMenu.vue'

const props = defineProps<IContactListProps>()
const emit = defineEmits<IContactListEmits>()
const {
  getContactAvatarId,
  getContactStatusTagColor,
  getContactActivityTagColor,
  inviteContact,
  deleteContact,
  updateContactInteraction,
  hasContactChatRoom,
  goToContactChat,
  createContactChat
} = useContactList(props, emit)
</script>

<template>
  <div class="contact-list">
    <div v-for="contact in props.contactList" :key="contact.id" class="contact-list__item nmorph--shadow-inset">
      <AppProfileBasicData
        class="contact-list__profile"
        :image-id="getContactAvatarId(contact.id)"
        :title="contact.nickname"
        :name="contact.nickname"
      >
        <template #title>
          <div class="contact-list__title">
            <div class="contact-list__name">
              <AppHeader tag="h5" truncate :text="contact.nickname" />
            </div>
            <NmorphBadge
              v-if="props.getContactStatus(contact)"
              class="contact-list__status"
              is-tag
              size="tiny"
              :color="getContactStatusTagColor(contact)"
              :value="props.getContactStatus(contact)"
            />
          </div>
        </template>
        <template #description>
          <NmorphBadge
            v-if="props.getContactActivity(contact)"
            is-tag
            size="tiny"
            :color="getContactActivityTagColor(contact)"
            :value="props.getContactActivity(contact)"
          />
        </template>
      </AppProfileBasicData>
      <div class="contact-list__actions">
        <NmorphButton
          v-if="contact.interactionType === 'default'"
          shape="square"
          :loading="props.loadingContactIds.has(contact.id)"
          :aria-label="$t(CONTACTS_PAGE_I18N.invite)"
          @click="inviteContact(contact.id)"
        >
          <template #icon>
            <NmorphIconPostCard />
          </template>
        </NmorphButton>
        <NmorphButton
          v-else-if="contact.interactionType === 'invite-accepted' && hasContactChatRoom(contact.id)"
          shape="square"
          :aria-label="$t(CONTACTS_PAGE_I18N.write)"
          @click="goToContactChat(contact.id)"
        >
          <template #icon>
            <NmorphIconChatLineSquare />
          </template>
        </NmorphButton>
        <NmorphButton
          v-else-if="contact.interactionType === 'invite-accepted'"
          shape="square"
          :loading="props.creatingChatContactIds.has(contact.id)"
          :aria-label="$t(CONTACTS_PAGE_I18N.createChat)"
          @click="createContactChat(contact.id)"
        >
          <template #icon>
            <NmorphIconChatLineSquare />
          </template>
        </NmorphButton>
        <ContactContextMenu :contact="contact" @delete="deleteContact" @update-interaction="updateContactInteraction" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.contact-list {
  display: grid;
  gap: 8px;
}

.contact-list__item {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
}

.contact-list__profile {
  flex: 1 1 auto;
  min-width: 0;
}

.contact-list__title {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.contact-list__name {
  min-width: 0;
}

.contact-list__status {
  flex: 0 0 auto;
}

.contact-list__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
