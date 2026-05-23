<script setup lang="ts">
import {
  NmorphBadge,
  NmorphCard,
  NmorphButton,
  NmorphIconChatLineSquare,
  NmorphIconPostCard
} from '@nmorph/nmorph-ui-kit'
import {
  CONTACT_INTERACTION,
  buildAvatarId,
  isAcceptedContactInteraction,
  isDefaultContactInteraction
} from 'global-shared'
import { computed } from 'vue'

import { AppText, AppProfileBasicData } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactListEmits, ContactListProps } from '../config/types'
import { getContactActivityTagColor } from '../lib/get-contact-activity-tag-color'
import { getContactStatusTagColor } from '../lib/get-contact-status-tag-color'
import { hasContactChatRoom } from '../lib/has-contact-chat-room'

import ContactContextMenu from './ContactContextMenu.vue'

const props = defineProps<ContactListProps>()
const emit = defineEmits<ContactListEmits>()
const contactChatRoomIdList = computed(() =>
  props.contactList
    .filter(
      ({ id, interactionType }) =>
        isAcceptedContactInteraction(interactionType) && hasContactChatRoom(props.getPersonalChatRoomId(id))
    )
    .map(({ id }) => id)
)
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
          :image-id="buildAvatarId(contact.id)"
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
            v-if="isDefaultContactInteraction(contact.interactionType)"
            shape="square"
            :loading="props.loadingContactIds.has(contact.id)"
            :aria-label="$t(CONTACTS_PAGE_I18N.invite)"
            @click="emit('update-interaction', contact.id, CONTACT_INTERACTION.INVITED)"
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
            v-else-if="isAcceptedContactInteraction(contact.interactionType)"
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

.contact-list__profile .app-profile-basic-data__content {
  gap: 4px;
}

.contact-list__profile .app-profile-basic-data__description:empty {
  display: none;
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
