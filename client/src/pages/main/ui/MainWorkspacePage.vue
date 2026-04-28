<script setup lang="ts">
import { Form } from '@primevue/forms'
import { type IEventGetSearchedContact, type IFrontendContact } from 'global-shared'
import { Badge, Button, InputText } from 'primevue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useInfoNotification } from 'src/entities/info-notification'
import { useSettings } from 'src/entities/setting'
import { socket } from 'src/shared/api'
import { formatLocalizedDate, formatLocalizedRelativeTime, useI18n } from 'src/shared/lib'
import { AppEmojiPicker, AppHeader, AppText } from 'src/shared/ui'

import { MAIN_PAGE_CONTACT_SEARCH_DEBOUNCE_MS } from '../config/constants'
import { MAIN_PAGE_I18N } from '../config/i18n'
import { useCall } from '../model/use-call'
import { useLoadRoomMessages } from '../model/use-load-room-messages'
import { useMessage } from '../model/use-message'
import { useSendMessage } from '../model/use-send-message'

import MessageList from './MessageList.vue'

const route = useRoute()
const { t } = useI18n()
const { chatRooms } = useChatRoom()
const { contacts } = useContact()
const { infoNotificationList } = useInfoNotification()
const { calls } = useCall()
const { messages, getById } = useMessage()
const { selectedWallpaper, settings } = useSettings()
const { hasMoreMessages, initializeLoadRoomMessages, isLoading, loadRoomMessages, resetRoomMessagesPagination } =
  useLoadRoomMessages()
const { messageText, sendMessage } = useSendMessage()

const selectedRoomId = ref('')
const selectedContactId = ref('')
const selectedInfoNotificationId = ref('')
const contactSearchQuery = ref('')
const searchedContacts = ref<IFrontendContact[]>([])
const hasMoreSearchedContacts = ref(false)
const nextSearchedContactsOffset = ref<number | undefined>()
const composerElement = ref<HTMLElement | { $el?: HTMLElement } | null>(null)
const isComposerEmojiPickerOpen = ref(false)
let contactSearchTimeoutId: ReturnType<typeof setTimeout> | undefined

// const activeNavItem = computed(() => {
//   const item = MAIN_PAGE_NAV_ITEMS.find(({ path }) => path === route.path)

//   if (item) return item

//   if (route.path.startsWith(MAIN_PAGE_ROUTES.settings)) {
//     return MAIN_PAGE_NAV_ITEMS.find(({ id }) => id === 'settings') ?? MAIN_PAGE_NAV_ITEMS[0]
//   }

//   return MAIN_PAGE_NAV_ITEMS[0]
// })
// const activeNavId = computed(() => activeNavItem.value.id)
const isChatContentVisible = computed(() => ['chatRooms', 'contacts', 'calls'].includes(activeNavId.value))
const activeRoom = computed(() => chatRooms.value.find(({ id }) => id === selectedRoomId.value))
const activeInfoNotification = computed(() =>
  infoNotificationList.value.find(({ id }) => id === selectedInfoNotificationId.value)
)
const activeRoomMessages = computed(() => (activeRoom.value?.messages ?? []).flatMap((id) => getById(id) ?? []))
const isContactsSearchMode = computed(() => Boolean(contactSearchQuery.value.trim()))
const shownContacts = computed(() => (isContactsSearchMode.value ? searchedContacts.value : contacts.value))

const isDefaultWallpaperVisible = computed(
  () => settings.value.showWallpaper && settings.value.wallpaper === 'default' && Boolean(selectedWallpaper.value)
)
const widgetWallpaperStyle = computed(() =>
  settings.value.showWallpaper && selectedWallpaper.value
    ? settings.value.wallpaper === 'default'
      ? {
          '--main-page-widget-wallpaper': `url(${selectedWallpaper.value})`
        }
      : {
          backgroundImage: `linear-gradient(var(--p-app-widget-background, var(--p-content-background)), var(--p-app-widget-background, var(--p-content-background))), url(${selectedWallpaper.value})`
        }
    : undefined
)

const getContactName = (id: string) => contacts.value.find((contact) => contact.id === id)?.username ?? id
const getContactStatus = (contact: IFrontendContact) =>
  contact.online ? MAIN_PAGE_I18N.online : MAIN_PAGE_I18N.offline
const getRoomTitle = (room = activeRoom.value) =>
  room?.chatName || room?.users.map(getContactName).join(', ') || t(MAIN_PAGE_I18N.selectRoom)
const getRoomLastMessage = (room = activeRoom.value) => {
  const lastMessageId = room?.lastMessageId || room?.messages[(room?.messages.length ?? 0) - 1]

  return lastMessageId ? getById(lastMessageId)?.body ?? '' : ''
}
const getRoomUnreadQuantity = (roomId: string) => {
  const roomMessageIds = new Set(chatRooms.value.find((room) => room.id === roomId)?.messages ?? [])

  return messages.value.filter(
    (message) => !message.isSelf && message.status === 'delivered' && roomMessageIds.has(message.id)
  ).length
}
const formatRelativeTime = (timestampMs?: number) =>
  timestampMs ? formatLocalizedRelativeTime(timestampMs, settings.value.language) : t(MAIN_PAGE_I18N.offline)
const formatDate = (timestampMs?: number) =>
  timestampMs ? formatLocalizedDate(timestampMs, settings.value.language) : ''

const loadActiveRoomMessages = () => {
  if (activeRoom.value) {
    loadRoomMessages(activeRoom.value.id)
  }
}

const toggleComposerEmojiPicker = () => {
  isComposerEmojiPickerOpen.value = !isComposerEmojiPickerOpen.value
}

const appendMessageEmoji = (value: string) => {
  messageText.value += value
  isComposerEmojiPickerOpen.value = false
}

const handleWindowClick = (event: MouseEvent) => {
  const { target } = event
  const element = composerElement.value instanceof HTMLElement ? composerElement.value : composerElement.value?.$el

  if (target instanceof Node && element?.contains(target)) return

  isComposerEmojiPickerOpen.value = false
}

const handleWindowKeydown = ({ key }: KeyboardEvent) => {
  if (key === 'Escape') {
    isComposerEmojiPickerOpen.value = false
  }
}

const updateSelectedRoom = (roomId: string) => {
  if (selectedRoomId.value === roomId) return

  selectedRoomId.value = roomId
}

const searchContacts = (offset = 0) => {
  const value = contactSearchQuery.value.trim()

  if (!value) {
    searchedContacts.value = []
    hasMoreSearchedContacts.value = false
    nextSearchedContactsOffset.value = undefined
    return
  }

  socket.emit('search-contact', { value, offset })
}

const scheduleContactSearch = () => {
  if (contactSearchTimeoutId) {
    clearTimeout(contactSearchTimeoutId)
  }

  contactSearchTimeoutId = setTimeout(() => searchContacts(), MAIN_PAGE_CONTACT_SEARCH_DEBOUNCE_MS)
}

const handleSearchedContacts = ({
  value,
  offset,
  contacts: nextContacts,
  hasMore,
  nextOffset
}: IEventGetSearchedContact) => {
  if (value !== contactSearchQuery.value.trim()) return

  searchedContacts.value = offset > 0 ? [...searchedContacts.value, ...nextContacts] : nextContacts
  hasMoreSearchedContacts.value = hasMore
  nextSearchedContactsOffset.value = nextOffset
}

const markInfoNotificationAsRead = (id: string) => {
  socket.emit('mark-info-notification-as-read', { id })
}

watch(contactSearchQuery, scheduleContactSearch)
watch(chatRooms, (rooms) => {
  if (!selectedRoomId.value && rooms[0]) {
    updateSelectedRoom(rooms[0].id)
  }
})
watch(contacts, (nextContacts) => {
  if (!selectedContactId.value && nextContacts[0]) {
    selectedContactId.value = nextContacts[0].id
  }
})
watch(infoNotificationList, (notifications) => {
  if (!selectedInfoNotificationId.value && notifications[0]) {
    selectedInfoNotificationId.value = notifications[0].id
  }
})
watch(selectedRoomId, (roomId) => {
  if (roomId) {
    resetRoomMessagesPagination()
    loadRoomMessages(roomId)
  }
})

onMounted(() => {
  initializeLoadRoomMessages()
  socket.on('get-searched-contact', handleSearchedContacts)
  window.addEventListener('click', handleWindowClick)
  window.addEventListener('keydown', handleWindowKeydown)
})

onBeforeUnmount(() => {
  socket.off('get-searched-contact', handleSearchedContacts)
  window.removeEventListener('click', handleWindowClick)
  window.removeEventListener('keydown', handleWindowKeydown)

  if (contactSearchTimeoutId) {
    clearTimeout(contactSearchTimeoutId)
  }
})
</script>

<template>
  <div class="main-workspace-page" :class="{ 'main-workspace-page--default-wallpaper': isDefaultWallpaperVisible }">
    <!-- <aside class="main-page__side-panel" :style="widgetWallpaperStyle">
      <div class="main-page__panel-header">
        <AppHeader
          class="main-page__panel-title"
          tag="h2"
          size="small"
          color="contrast-color"
          :text="$t(activeNavItem.label)"
        />
        <Button
          v-if="activeNavId === 'contacts' && hasMoreSearchedContacts"
          :aria-label="$t(MAIN_PAGE_I18N.loadMore)"
          rounded
          size="small"
          text
          icon="pi pi-arrow-down"
          @click="searchContacts(nextSearchedContactsOffset)"
        />
      </div>

      <InputText
        v-if="activeNavId === 'contacts'"
        v-model="contactSearchQuery"
        fluid
        :placeholder="$t(MAIN_PAGE_I18N.search)"
        size="small"
      />

      <div v-if="activeNavId === 'chatRooms'" class="main-page__panel-list">
        <button
          v-for="room in chatRooms"
          :key="room.id"
          class="main-page__panel-item"
          :class="{ 'main-page__panel-item--active': selectedRoomId === room.id }"
          type="button"
          @click="updateSelectedRoom(room.id)"
        >
          <span>{{ getRoomTitle(room) }}</span>
          <AppText
            class="main-page__panel-item-meta"
            size="small"
            :text="getRoomLastMessage(room) || $t(MAIN_PAGE_I18N.noMessages)"
          />
          <Badge v-if="getRoomUnreadQuantity(room.id)" :value="getRoomUnreadQuantity(room.id)" />
        </button>
        <AppText v-if="!chatRooms.length" class="main-page__empty" tag="p" :text="$t(MAIN_PAGE_I18N.noRooms)" />
      </div>

      <div v-if="activeNavId === 'contacts'" class="main-page__panel-list">
        <button
          v-for="contact in shownContacts"
          :key="contact.id"
          class="main-page__panel-item"
          :class="{ 'main-page__panel-item--active': selectedContactId === contact.id }"
          type="button"
          @click="selectedContactId = contact.id"
        >
          <span>{{ contact.username }}</span>
          <AppText class="main-page__panel-item-meta" size="small" :text="$t(getContactStatus(contact))" />
        </button>
        <AppText
          v-if="!shownContacts.length"
          class="main-page__empty"
          tag="p"
          :text="$t(isContactsSearchMode ? MAIN_PAGE_I18N.noSearchResults : MAIN_PAGE_I18N.noContacts)"
        />
      </div>

      <div v-if="activeNavId === 'calls'" class="main-page__panel-list">
        <button v-for="call in calls" :key="call.id" class="main-page__panel-item" type="button">
          <span>{{ call.interlocutorName }}</span>
          <AppText class="main-page__panel-item-meta" size="small" :text="formatDate(call.calledAt)" />
        </button>
        <AppText v-if="!calls.length" class="main-page__empty" tag="p" :text="$t(MAIN_PAGE_I18N.callsEmpty)" />
      </div>

      <div v-if="activeNavId === 'infoNotifications'" class="main-page__panel-list">
        <button
          v-for="notification in infoNotificationList"
          :key="notification.id"
          class="main-page__panel-item"
          :class="{ 'main-page__panel-item--active': selectedInfoNotificationId === notification.id }"
          type="button"
          @click="selectedInfoNotificationId = notification.id"
        >
          <span>{{ $t(notification.title) }}</span>
          <AppText class="main-page__panel-item-meta" size="small" :text="formatDate(notification.createdAt)" />
          <Badge v-if="notification.status === 'unread'" :value="$t(MAIN_PAGE_I18N.markAsRead)" />
        </button>
        <AppText
          v-if="!infoNotificationList.length"
          class="main-page__empty"
          tag="p"
          :text="$t(MAIN_PAGE_I18N.noNotifications)"
        />
      </div>
    </aside>

    <section class="main-page__content" :style="widgetWallpaperStyle">
      <template v-if="isChatContentVisible">
        <header class="main-page__content-header">
          <div>
            <AppHeader
              class="main-page__content-title"
              tag="h1"
              size="medium"
              color="contrast-color"
              :text="getRoomTitle()"
            />
            <AppText
              class="main-page__content-subtitle"
              tag="p"
              :text="activeRoom ? getRoomLastMessage() || $t(MAIN_PAGE_I18N.noMessages) : $t(MAIN_PAGE_I18N.selectRoom)"
            />
          </div>
        </header>

        <MessageList
          v-if="activeRoom"
          :room-id="activeRoom.id"
          :messages="activeRoomMessages"
          :has-more-messages="hasMoreMessages"
          :is-loading="isLoading"
          :format-relative-time="formatRelativeTime"
          @load-more="loadActiveRoomMessages"
        />

        <AppText v-else class="main-page__empty" tag="p" :text="$t(MAIN_PAGE_I18N.selectRoom)" />

        <Form
          v-if="activeRoom"
          ref="composerElement"
          class="main-page__composer"
          @click.stop
          @submit="sendMessage(activeRoom.id)"
        >
          <Button :aria-label="$t(MAIN_PAGE_I18N.uploadAttachment)" size="small" type="button" icon="pi pi-paperclip" />
          <Button
            :aria-label="$t(MAIN_PAGE_I18N.openEmojiPicker)"
            class="main-page__emoji-button"
            size="small"
            type="button"
            icon="pi pi-face-smile"
            @click="toggleComposerEmojiPicker"
          />
          <InputText
            v-model="messageText"
            autocomplete="off"
            fluid
            :placeholder="$t(MAIN_PAGE_I18N.message)"
            size="small"
          />
          <Button :aria-label="$t(MAIN_PAGE_I18N.send)" size="small" type="submit" icon="pi pi-send" />
          <div v-if="isComposerEmojiPickerOpen" class="main-page__emoji-popover" @click.stop>
            <AppEmojiPicker
              :expand-label="$t(MAIN_PAGE_I18N.expandEmojiPicker)"
              :language="settings.language"
              @select="appendMessageEmoji"
            />
          </div>
        </Form>
      </template>

      <template v-if="activeNavId === 'infoNotifications'">
        <header class="main-page__content-header">
          <div>
            <AppHeader
              class="main-page__content-title"
              tag="h1"
              size="medium"
              color="contrast-color"
              :text="activeInfoNotification ? $t(activeInfoNotification.title) : $t(MAIN_PAGE_I18N.info)"
            />
            <AppText
              class="main-page__content-subtitle"
              tag="p"
              :text="
                activeInfoNotification
                  ? formatDate(activeInfoNotification.createdAt)
                  : $t(MAIN_PAGE_I18N.noNotifications)
              "
            />
          </div>
        </header>

        <article v-if="activeInfoNotification" class="main-page__document">
          <AppText
            v-for="paragraph in $t(activeInfoNotification.content)"
            :key="paragraph"
            class="main-page__document-paragraph"
            tag="p"
            color="semi-contrast-color"
            :text="paragraph"
          />
          <Button
            v-if="activeInfoNotification.status === 'unread'"
            :label="$t(MAIN_PAGE_I18N.markAsRead)"
            size="small"
            @click="markInfoNotificationAsRead(activeInfoNotification.id)"
          />
        </article>
      </template>
    </section> -->
  </div>
</template>

<style>
.main-page {
  position: relative;

  overflow: hidden;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;

  height: 100dvh;
  padding: 12px;

  background: var(--p-app-main-bg);
}

.main-page--wallpaper-hidden {
  background: var(--p-app-main-bg);
}

.main-page__left-bar,
.main-page__workspace {
  position: relative;
  z-index: 1;
}

.main-page__left-bar,
.main-page__top-bar,
.main-page__side-panel,
.main-page__content {
  isolation: isolate;
  position: relative;

  overflow: hidden;

  border: 1px solid var(--p-app-widget-border-color, var(--p-content-border-color));
  border-radius: 18px;

  background-color: var(--p-app-widget-background, var(--p-content-background));
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 320px auto;
  box-shadow: 12px 12px 28px var(--p-app-shadow-outset-start), -12px -12px 28px var(--p-app-shadow-outset-end);
}

.main-workspace-page--default-wallpaper .main-page__left-bar::before,
.main-workspace-page--default-wallpaper .main-page__top-bar::before,
.main-workspace-page--default-wallpaper .main-page__side-panel::before,
.main-workspace-page--default-wallpaper .main-page__content::before {
  pointer-events: none;
  content: '';

  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-50deg);

  width: 240vmax;
  height: 240vmax;

  opacity: 0.3;
  background-image: var(--main-page-widget-wallpaper);
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 280px auto;
}

.main-page__left-bar > *,
.main-page__top-bar > *,
.main-page__side-panel > *,
.main-page__content > * {
  position: relative;
  z-index: 1;
}

.main-page__left-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  min-width: 0;
  padding: 10px 8px;
}

.main-page__brand {
  border-radius: 12px;
  background: var(--p-app-widget-background, var(--p-content-background));
}

.main-page__brand {
  width: 38px;
  height: 38px;
  padding: 6px;
}

.main-page__brand img {
  display: block;
}

.main-page__brand img {
  width: 100%;
  height: 100%;
}

.main-page__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  margin-block: auto;
}

.main-page__nav :deep(.p-button) {
  position: relative;

  display: grid;
  place-items: center;

  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 8px;
}

.main-page__nav :deep(.app-icon) {
  position: relative;
  z-index: 1;
}

.main-page__nav :deep(.p-badge) {
  position: absolute;
  z-index: 2;
  top: 4px;
  right: 4px;

  min-width: 16px;
  height: 16px;
  padding: 0 4px;

  font-size: 0.7rem;
  font-weight: 500;
  line-height: 16px;
}

.main-page__nav-button--active {
  color: var(--p-primary-contrast-color);
  background: var(--p-primary-color);
}

.main-page__workspace {
  display: grid;
  grid-template-rows: 58px minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.main-page__top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-width: 0;
  padding: 8px 12px;
}

.main-page__top-actions,
.main-page__content-header,
.main-page__content-actions {
  display: flex;
  align-items: center;
}

.main-page__panel-item span,
.main-page__panel-item-meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-page__top-actions,
.main-page__content-actions {
  gap: 8px;
}

.main-page__top-actions :deep(.p-badge) {
  font-weight: 500;
}

.main-workspace-page {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.main-page__side-panel,
.main-page__content {
  overflow: hidden;
  min-height: 0;
}

.main-page__side-panel {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
}

.main-page__panel-header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.main-page__panel-title {
  overflow-wrap: anywhere;
}

.main-page__panel-list,
.main-page__content-list,
.main-page__document {
  overflow: auto;
  display: grid;
  gap: 8px;
  align-content: start;

  min-height: 0;
}

.main-page__panel-item,
.main-page__contact-card,
.main-page__content-row,
.main-page__document {
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  background: var(--p-app-muted-background);
}

.main-page__panel-item {
  cursor: pointer;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 4px;
  align-items: center;

  width: 100%;
  padding: 12px;

  color: var(--p-app-text-contrast);
  text-align: left;
}

.main-page__panel-item-meta {
  grid-column: 1 / -1;
}

.main-page__panel-item:hover,
.main-page__panel-item--active {
  border-color: var(--p-primary-color);
}

.main-page__settings {
  display: grid;
  gap: 8px;
  align-content: start;
}

.main-page__settings-content,
.main-page__settings-field,
.main-page__switch {
  display: grid;
  gap: 12px;
  align-content: start;
}

.main-page__settings-content {
  overflow: auto;
  min-height: 0;
}

.main-page__settings-submit {
  justify-self: start;
}

.main-page__settings-hint {
  max-width: 680px;
}

.main-page__account-section {
  display: grid;
  gap: 14px;
  align-content: start;

  padding: 14px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-app-muted-background);
}

.main-page__account-profile,
.main-page__account-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.main-page__account-name,
.main-page__account-id {
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-page__account-avatar {
  overflow: hidden;
  display: grid;
  flex: 0 0 auto;
  place-items: center;

  width: 72px;
  height: 72px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  color: var(--p-primary-color);

  background: var(--p-app-widget-background, var(--p-content-background));
}

.main-page__account-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-page__account-actions {
  flex-wrap: wrap;
}

.main-page__switch {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.main-page__device-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 36px;
  gap: 8px;
  align-items: center;
}

.main-page__device-control :deep(.p-button) {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.main-page__audio-level {
  overflow: hidden;
  height: 8px;
  border-radius: 8px;
  background: var(--p-app-muted-background);
}

.main-page__audio-level span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--p-primary-color);
}

.main-page__video-preview {
  aspect-ratio: 16 / 9;
  width: min(420px, 100%);
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  object-fit: cover;
  background: var(--p-app-muted-background);
}

.main-page__wallpaper-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
}

.main-page__wallpaper-option {
  cursor: pointer;

  display: grid;
  gap: 10px;
  align-items: stretch;

  min-height: 144px;
  padding: 12px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  color: var(--p-app-text-contrast);
  text-align: left;

  background-color: var(--p-app-muted-background);
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 120px auto;
}

.main-page__wallpaper-option:hover,
.main-page__wallpaper-option--active {
  border-color: var(--p-primary-color);
}

.main-page__wallpaper-title {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--p-app-widget-background, var(--p-content-background));
}

.main-page__wallpaper-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.main-page__wallpaper-preview-card {
  display: grid;
  align-items: end;

  min-height: 86px;
  padding: 8px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  font-size: 0.82rem;

  background-color: var(--p-app-muted-background);
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 100px auto;
}

.main-page__file-button {
  cursor: pointer;

  position: relative;

  display: grid;
  place-items: center;

  min-height: 42px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  color: var(--p-app-text-contrast);

  background: var(--p-app-muted-background);
}

.main-page__file-button--inline {
  min-height: 36px;
  padding: 0 12px;
}

.main-page__file-button:hover {
  border-color: var(--p-primary-color);
}

.main-page__file-button input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.main-page__sound-options {
  display: grid;
  gap: 8px;
}

.main-page__sound-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;

  min-height: 52px;
  padding: 8px 12px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  color: var(--p-app-text-contrast);
  text-align: left;

  background: var(--p-app-muted-background);
}

.main-page__sound-option:hover,
.main-page__sound-option--active {
  border-color: var(--p-primary-color);
}

.main-page__sound-select {
  cursor: pointer;

  min-width: 0;
  padding: 0;
  border: 0;

  color: var(--p-app-text-contrast);
  text-align: left;

  background: transparent;
}

.main-page__sound-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.main-page__sound-actions :deep(.p-button) {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
}

.main-page__sound-upload {
  cursor: pointer;

  position: relative;

  display: grid;
  place-items: center;

  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;

  color: var(--p-primary-color);
}

.main-page__sound-upload:hover {
  background: var(--p-app-muted-background);
}

.main-page__sound-upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.main-page__content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  padding: 16px;
}

.main-page__content-header {
  gap: 12px;
}

.main-page__content-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;

  width: 42px;
  height: 42px;
  border-radius: 50%;

  color: var(--p-primary-contrast-color);

  background: var(--p-primary-color);
}

.main-page__content-title {
  overflow-wrap: anywhere;
}

.main-page__composer {
  position: relative;

  display: grid;
  grid-template-columns: 42px 42px minmax(0, 1fr) 42px;
  gap: 10px;
  align-items: stretch;
  justify-self: stretch;

  width: 100%;
}

.main-page__composer :deep(.p-inputtext) {
  height: 42px;
}

.main-page__composer :deep(.p-button) {
  display: grid;
  place-items: center;

  width: 42px;
  min-width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 8px;
}

.main-page__emoji-popover {
  position: absolute;
  z-index: 20;
  bottom: calc(100% + 8px);
  left: 0;

  width: min(340px, calc(100vw - 32px));
}

.main-page__contact-card,
.main-page__content-row,
.main-page__document {
  padding: 14px;
}

.main-page__contact-card {
  display: grid;
  gap: 12px;
  align-content: start;
}

.main-page__content-row {
  display: grid;
  gap: 4px;
}

.main-page__empty {
  padding: 12px;
}

@include screen-until('tablet') {
  .main-page {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 62px;
  }

  .main-page__left-bar {
    grid-row: 2;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 10px;
  }

  .main-page__nav {
    flex-direction: row;
    margin-block: 0;
  }

  .main-workspace-page {
    grid-template-columns: 1fr;
  }

  .main-page__side-panel {
    min-height: 220px;
  }
}
</style>
