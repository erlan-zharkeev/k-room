<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphIconChatLineSquare, NmorphIconPostCard } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { AppText, AppProfileBasicData } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactListEmits, IContactListProps } from '../config/types'
import { getContactActivityTagColor } from '../lib/get-contact-activity-tag-color'
import { getContactAvatarId } from '../lib/get-contact-avatar-id'
import { getContactStatusTagColor } from '../lib/get-contact-status-tag-color'
import { hasContactChatRoom } from '../lib/has-contact-chat-room'

import ContactContextMenu from './ContactContextMenu.vue'

const props = defineProps<IContactListProps>()
const emit = defineEmits<IContactListEmits>()
const contactChatRoomIdList = computed(() =>
  props.contactList
    .filter(
      ({ id, interactionType }) =>
        interactionType === 'invite-accepted' && hasContactChatRoom(props.getPersonalChatRoomId(id))
    )
    .map(({ id }) => id)
)
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
              <AppText truncate :text="contact.nickname" />
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
          @click="emit('update-interaction', contact.id, 'invited')"
        >
          <template #icon>
            <NmorphIconPostCard />
          </template>
        </NmorphButton>
        <NmorphButton
          v-else-if="contactChatRoomIdList.includes(contact.id)"
          shape="square"
          :aria-label="$t(CONTACTS_PAGE_I18N.write)"
          @click="emit('go-to-chat', props.getPersonalChatRoomId(contact.id))"
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
          @click="emit('create-chat', contact.id)"
        >
          <template #icon>
            <NmorphIconChatLineSquare />
          </template>
        </NmorphButton>
        <ContactContextMenu
          :contact="contact"
          @delete="emit('delete', $event)"
          @update-interaction="(id, interaction) => emit('update-interaction', id, interaction)"
        />
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

  padding: 8px 12px 8px 8px;
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
