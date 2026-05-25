<script setup lang="ts">
import { NmorphBadge, NmorphCard } from '@nmorph/nmorph-ui-kit'

import { UserActivityStatus } from 'src/features/user-activity-status'
import { AppText, AppProfileBasicData } from 'src/shared/ui'

import type { ContactListEmits, ContactListProps } from '../config/types'
import { getContactStatusTagColor } from '../lib/get-contact-status-tag-color'

import ContactContextMenu from './ContactContextMenu.vue'

const props = defineProps<ContactListProps>()
const emit = defineEmits<ContactListEmits>()
</script>

<template>
  <div class="contact-list">
    <NmorphBadge
      v-for="contact in props.contactList"
      :key="contact.id"
      :value="props.getContactStatus(contact)"
      hide-on-falsy-value
      type="ribbon"
      :ribbon-tilt="false"
      size="tiny"
      ribbon-corner="bottom-left"
      :offset-y="2"
      :color="getContactStatusTagColor(contact)"
    >
      <NmorphCard class="contact-list__item" content-class="contact-list__item-content" shadow-type="inset">
        <AppProfileBasicData
          class="contact-list__profile"
          :image-id="contact.avatarId"
          :title="contact.nickname"
          :name="contact.nickname"
        >
          <template #title>
            <div class="contact-list__title">
              <div class="contact-list__name">
                <AppText truncate :text="contact.nickname" />
              </div>
            </div>
          </template>
          <template #description>
            <UserActivityStatus
              v-if="props.isContactActivityVisible(contact)"
              :online="contact.online"
              :last-seen="contact.lastSeen"
            />
          </template>
        </AppProfileBasicData>
        <div class="contact-list__actions">
          <ContactContextMenu
            :contact="contact"
            :is-creating-chat="props.creatingChatContactIds.has(contact.id)"
            :is-updating-contact="props.loadingContactIds.has(contact.id)"
            :personal-chat-room-id="props.getPersonalChatRoomId(contact.id)"
            @create-chat="emit('create-chat', $event)"
            @delete="emit('delete', $event)"
            @go-to-chat="emit('go-to-chat', $event)"
            @update-interaction="(id, interaction) => emit('update-interaction', id, interaction)"
          />
        </div>
      </NmorphCard>
    </NmorphBadge>
  </div>
</template>

<style lang="scss">
.contact-list {
  display: grid;
  gap: 8px;
}

.contact-list__item-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;

  padding-right: 4px;
}

.contact-list__profile {
  min-width: 0;
}

.contact-list__title {
  display: flex;
  gap: 8px;
  align-items: center;
}

.contact-list__name {
  flex: 1 1 56px;
  min-width: 0;
}

.contact-list__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nmorph-badge .nmorph-badge__ribbon-corner--flat .nmorph-badge__container--ribbon {
  border-top-right-radius: 8px;
}
</style>
