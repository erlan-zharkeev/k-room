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
.main-workspace-page {
    background: green;
}
</style>
