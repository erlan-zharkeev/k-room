<script setup lang="ts">
import {
  NmorphButton,
  NmorphDropdown,
  NmorphIcon,
  NmorphIconChatLineSquare,
  NmorphIconCheck,
  NmorphIconClose,
  NmorphIconDelete,
  NmorphIconEyeBlocked,
  NmorphIconMore,
  NmorphIconPostCard
} from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData, AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactListEmits, IContactListProps } from '../config/types'
import { useContactList } from '../model/use-contact-list.model'

const props = defineProps<IContactListProps>()
const emit = defineEmits<IContactListEmits>()
const {
  openedContactMenuId,
  getContactAvatarId,
  setContactMenuButtonRef,
  getContactMenuRelativeElement,
  closeContactMenu,
  toggleContactMenu,
  inviteContact,
  acceptContactInvite,
  declineContactInvite,
  deleteContact,
  blockContact,
  unblockContact,
  hasContactChatRoom,
  goToContactChat,
  createContactChat
} = useContactList(props, emit)
</script>

<template>
  <div class="contact-list">
    <div v-for="contact in props.contactList" :key="contact.id" class="contact-list__item nmorph--shadow-inset">
      <AppProfileBasicData
        :image-id="getContactAvatarId(contact.id)"
        :title="contact.nickname"
        :name="contact.nickname"
      >
        <template #description>
          <AppText
            v-if="props.getContactDescription(contact)"
            tag="small"
            :color="contact.interactionType === 'blocked' ? 'warn' : contact.online ? 'accent' : 'semi-contrast-text'"
            truncate
            :text="props.getContactDescription(contact)"
          />
          <div
            v-else-if="contact.interactionType === 'invited' || contact.interactionType === 'invite-received'"
            class="contact-list__invite-controls"
          >
            <AppText
              v-if="contact.interactionType === 'invited'"
              tag="small"
              color="accent"
              :text="$t(CONTACTS_PAGE_I18N.invited)"
            />
            <template v-else-if="contact.interactionType === 'invite-received'">
              <NmorphButton
                height="thin"
                shape="square"
                :loading="props.loadingContactIds.has(contact.id)"
                :aria-label="$t(CONTACTS_PAGE_I18N.accept)"
                @click="acceptContactInvite(contact.id)"
              >
                <template #icon>
                  <NmorphIconCheck />
                </template>
              </NmorphButton>
              <NmorphButton
                height="thin"
                shape="square"
                color="var(--nmorph-error-text-color)"
                :loading="props.loadingContactIds.has(contact.id)"
                :aria-label="$t(CONTACTS_PAGE_I18N.decline)"
                @click="declineContactInvite(contact.id)"
              >
                <template #icon>
                  <NmorphIconClose />
                </template>
              </NmorphButton>
              <NmorphButton
                height="thin"
                shape="square"
                :loading="props.loadingContactIds.has(contact.id)"
                :aria-label="$t(CONTACTS_PAGE_I18N.block)"
                @click="blockContact(contact.id)"
              >
                <template #icon>
                  <NmorphIconEyeBlocked />
                </template>
              </NmorphButton>
            </template>
          </div>
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
        <div :ref="(element) => setContactMenuButtonRef(contact.id, element)" class="contact-list__menu-wrapper">
          <NmorphButton
            shape="square"
            :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)"
            @click="toggleContactMenu(contact.id)"
          >
            <template #icon>
              <NmorphIconMore class="contact-list__menu-icon" />
            </template>
          </NmorphButton>
          <NmorphDropdown
            v-if="openedContactMenuId === contact.id"
            open
            :relative-element="getContactMenuRelativeElement(contact.id)"
            :width="176"
            :fill-width="false"
            :y-offset="8"
            @on-outside-click="closeContactMenu"
          >
            <div class="contact-list__menu">
              <button class="contact-list__menu-item" type="button" @click="deleteContact(contact.id)">
                <NmorphIcon color="var(--nmorph-error-text-color)">
                  <NmorphIconDelete />
                </NmorphIcon>
                <AppText tag="span" color="error-text" :text="$t(CONTACTS_PAGE_I18N.delete)" />
              </button>
              <button
                v-if="contact.interactionType === 'blocked'"
                class="contact-list__menu-item"
                type="button"
                @click="unblockContact(contact.id)"
              >
                <NmorphIcon>
                  <NmorphIconClose />
                </NmorphIcon>
                <AppText tag="span" :text="$t(CONTACTS_PAGE_I18N.unblock)" />
              </button>
              <button v-else class="contact-list__menu-item" type="button" @click="blockContact(contact.id)">
                <NmorphIcon>
                  <NmorphIconEyeBlocked />
                </NmorphIcon>
                <AppText tag="span" :text="$t(CONTACTS_PAGE_I18N.block)" />
              </button>
            </div>
          </NmorphDropdown>
        </div>
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

  min-width: 0;
  padding: 8px;
  border: 1px solid var(--app-content-border-color);
  border-radius: 6px;

  background: var(--app-content-background);
}

.contact-list__invite-controls,
.contact-list__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.contact-list__actions {
  flex: 0 0 auto;
}

.contact-list__menu-wrapper {
  display: flex;
}

.contact-list__menu-icon {
  transform: rotate(90deg);
}

.contact-list__menu {
  display: grid;
  gap: 4px;
  padding: 6px;
}

.contact-list__menu-item {
  cursor: pointer;

  display: flex;
  gap: 8px;
  align-items: center;

  width: 100%;
  padding: 8px;
  border: 0;
  border-radius: 4px;

  text-align: left;

  background: transparent;
}

.contact-list__menu-item:hover {
  background: var(--app-content-background);
}
</style>
