<script setup lang="ts">
import {
  NmorphBadge,
  NmorphButton,
  NmorphDialog,
  NmorphDivider,
  NmorphIconChatLineSquare,
  NmorphIconCheck,
  NmorphIconClose,
  NmorphIconDelete,
  NmorphIconPlus,
  NmorphIconSearch,
  NmorphTextInput
} from '@nmorph/nmorph-ui-kit'
import { useDebounceFn } from '@vueuse/core'
import {
  normalizeTimestamp,
  type IEventCreateRoom,
  type IEventGetSearchedContact,
  type IEventRoomCreated,
  type IEventSaveContact,
  type IEventSearchContact,
  type IEventUpdateInteraction,
  type IFrontendContact,
  type InteractionType,
  type SocketActionsType
} from 'global-shared'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSettings } from 'src/entities/setting'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { socket } from 'src/shared/api'
import { formatLocalizedRelativeTime, useI18n, type DbContactType } from 'src/shared/lib'
import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { APP_PAGE_CONTACT_SEARCH_DEBOUNCE_MS } from '../config/constants'
import { APP_PAGE_I18N } from '../config/i18n'

const route = useRoute()
const router = useRouter()
const { contacts, isExist } = useContact()
const { getPersonalByContactId } = useChatRoom()
const { settings } = useSettings()
const { t } = useI18n()

const searchQuery = ref('')
const searchedContacts = ref<IFrontendContact[]>([])
const searchTotal = ref<number | null>(null)
const searchHasMore = ref(false)
const searchNextOffset = ref(0)
const searchValue = ref('')
const isSearchLoading = ref(false)
const isSearchLoadingMore = ref(false)
const contactToDeleteId = ref('')
const loadingContactIds = reactive(new Set<string>())
const creatingChatContactIds = reactive(new Set<string>())

const contentTab = computed(() => route.path.split('/').filter(Boolean)[1])
const contactList = computed(() =>
  [...contacts.value]
    .filter(({ interactionType }) => interactionType !== 'invite-hidden')
    .sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))
)
const foundContactList = computed(() =>
  searchedContacts.value.filter(({ interactionType }) => interactionType !== 'invite-hidden')
)
const hasSearchQuery = computed(() => Boolean(searchQuery.value.trim()))
const showSearchResults = computed(
  () => hasSearchQuery.value && (isSearchLoading.value || searchTotal.value !== null || foundContactList.value.length)
)
const isDeleteDialogOpen = computed({
  get: () => Boolean(contactToDeleteId.value),
  set: (value) => {
    if (!value) {
      contactToDeleteId.value = ''
    }
  }
})

const getContactAvatarId = (id: string) => `avatar.${id}`

const getContactDescription = ({ interactionType, lastSeen, online }: DbContactType) => {
  if (interactionType !== 'invite-accepted') return ''
  if (online) return t(APP_PAGE_I18N.contactOnline)

  const normalized = normalizeTimestamp(lastSeen)

  if (!normalized) return ''

  return `${t(APP_PAGE_I18N.contactLastSeen)} ${formatLocalizedRelativeTime(
    normalized,
    settings.value.localization.language
  )}`
}

const resetSearchResults = () => {
  searchedContacts.value = []
  searchTotal.value = null
  searchHasMore.value = false
  searchNextOffset.value = 0
  isSearchLoading.value = false
  isSearchLoadingMore.value = false
}

const fetchContacts = (value: string, offset = 0) => {
  const payload: IEventSearchContact = {
    value,
    offset
  }

  socket.emit<SocketActionsType>('search-contact', payload)
}

const debouncedFetchContacts = useDebounceFn(fetchContacts, APP_PAGE_CONTACT_SEARCH_DEBOUNCE_MS)

const searchContacts = () => {
  const value = searchQuery.value.trim()

  searchValue.value = value

  if (!value) {
    resetSearchResults()
    return
  }

  isSearchLoading.value = true
  resetSearchResults()
  isSearchLoading.value = true
  debouncedFetchContacts(value)
}

const loadMoreSearchedContacts = () => {
  if (!searchValue.value || !searchHasMore.value || isSearchLoading.value || isSearchLoadingMore.value) return

  isSearchLoadingMore.value = true
  fetchContacts(searchValue.value, searchNextOffset.value)
}

const handleSearchedContacts = (payload: IEventGetSearchedContact) => {
  if (payload.value !== searchValue.value) return

  const knownIds = new Set(searchedContacts.value.map(({ id }) => id))
  const nextContacts =
    payload.offset === 0
      ? payload.contacts
      : [...searchedContacts.value, ...payload.contacts.filter(({ id }) => !knownIds.has(id))]

  searchedContacts.value = nextContacts
  searchTotal.value = payload.total
  searchHasMore.value = payload.hasMore
  searchNextOffset.value = payload.nextOffset ?? 0
  isSearchLoading.value = false
  isSearchLoadingMore.value = false
}

const addContact = (interlocutorId: string) => {
  if (loadingContactIds.has(interlocutorId)) return

  const payload: IEventSaveContact = { interlocutorId }

  loadingContactIds.add(interlocutorId)
  socket.emit<SocketActionsType>('save-contact', payload)
  socket.once<SocketActionsType>('contact-add-success', () => {
    loadingContactIds.delete(interlocutorId)
  })
}

const updateInteraction = (contactId: string, interaction: InteractionType) => {
  if (loadingContactIds.has(contactId)) return

  const payload: IEventUpdateInteraction = { contactId, interaction }

  loadingContactIds.add(contactId)
  socket.emit<SocketActionsType>('update-contact-interaction-type', payload)
  socket.once<SocketActionsType>('contact-interaction-updated', () => {
    loadingContactIds.delete(contactId)
  })
}

const goToChatRoom = (roomId?: string) => {
  if (!roomId) return

  router.push(`${APP_PAGE_ROUTES.chatRooms}/${roomId}`)
}

const createPrivateChat = (contactId: string) => {
  if (creatingChatContactIds.has(contactId)) return

  const payload: IEventCreateRoom = { contactIds: [contactId] }

  creatingChatContactIds.add(contactId)
  socket.emit<SocketActionsType>('create-chat-room', payload)
  socket.once<SocketActionsType>('room-created', ({ roomId }: IEventRoomCreated) => {
    creatingChatContactIds.delete(contactId)
    goToChatRoom(roomId)
  })
}

const openDeleteDialog = (contactId: string) => {
  contactToDeleteId.value = contactId
}

const deleteContact = () => {
  if (!contactToDeleteId.value) return

  updateInteraction(contactToDeleteId.value, 'default')
  contactToDeleteId.value = ''
}

socket.on<SocketActionsType>('get-searched-contact', handleSearchedContacts)

onBeforeUnmount(() => {
  socket.off<SocketActionsType>('get-searched-contact', handleSearchedContacts)
})
</script>

<template>
  <section class="app-navigation-page">
    <div v-if="contentTab === 'contacts'" class="app-navigation-page__contacts">
      <div class="app-navigation-page__search">
        <NmorphTextInput
          v-model="searchQuery"
          clearable
          :placeholder="$t(APP_PAGE_I18N.contactSearch)"
          :input-attrs="{ 'aria-label': $t(APP_PAGE_I18N.contactSearch) }"
          @update:model-value="searchContacts"
        >
          <template #prepend-icon>
            <NmorphIconSearch />
          </template>
        </NmorphTextInput>
        <div v-if="showSearchResults" class="app-navigation-page__search-results">
          <AppHeader tag="h5" :text="$t(APP_PAGE_I18N.contactSearchResults)" />
          <AppText v-if="isSearchLoading" tag="small" color="semi-contrast-text" :text="$t(APP_PAGE_I18N.loading)" />
          <AppText
            v-else-if="!foundContactList.length"
            tag="small"
            color="semi-contrast-text"
            :text="$t(APP_PAGE_I18N.contactSearchEmpty)"
          />
          <div v-else class="app-navigation-page__found-list">
            <div v-for="contact in foundContactList" :key="contact.id" class="app-navigation-page__found-item">
              <AppProfileBasicData :image-id="getContactAvatarId(contact.id)" :title="contact.nickname" />
              <NmorphButton
                v-if="contact.interactionType === 'default' && !isExist(contact.id)"
                shape="square"
                :loading="loadingContactIds.has(contact.id)"
                :aria-label="$t(APP_PAGE_I18N.contactAdd)"
                @click="addContact(contact.id)"
              >
                <template #icon>
                  <NmorphIconPlus />
                </template>
              </NmorphButton>
              <NmorphBadge v-else is-tag size="tiny" :value="$t(APP_PAGE_I18N.contactInvited)" />
            </div>
            <NmorphButton
              v-if="searchHasMore"
              class="app-navigation-page__load-more"
              :text="$t(APP_PAGE_I18N.loadMore)"
              :loading="isSearchLoadingMore"
              @click="loadMoreSearchedContacts"
            />
          </div>
        </div>
      </div>
      <NmorphDivider />
      <AppHeader tag="h4" :text="$t(APP_PAGE_I18N.contactListTitle)" />
      <AppText v-if="!contactList.length" color="semi-contrast-text" :text="$t(APP_PAGE_I18N.contactListEmpty)" />
      <div v-else class="app-navigation-page__contact-list">
        <div v-for="contact in contactList" :key="contact.id" class="app-navigation-page__contact-item">
          <AppProfileBasicData
            :image-id="getContactAvatarId(contact.id)"
            :title="contact.nickname"
            :name="contact.nickname"
          >
            <template #description>
              <AppText
                v-if="getContactDescription(contact)"
                tag="small"
                :color="contact.online ? 'accent' : 'semi-contrast-text'"
                truncate
                :text="getContactDescription(contact)"
              />
              <div v-else class="app-navigation-page__invite-controls">
                <NmorphButton
                  v-if="contact.interactionType === 'default'"
                  height="thin"
                  :text="$t(APP_PAGE_I18N.contactInvite)"
                  :loading="loadingContactIds.has(contact.id)"
                  @click="updateInteraction(contact.id, 'invited')"
                />
                <AppText
                  v-else-if="contact.interactionType === 'invited'"
                  tag="small"
                  color="accent"
                  :text="$t(APP_PAGE_I18N.contactInvited)"
                />
                <template v-else-if="contact.interactionType === 'invite-received'">
                  <NmorphButton
                    height="thin"
                    shape="square"
                    :loading="loadingContactIds.has(contact.id)"
                    :aria-label="$t(APP_PAGE_I18N.contactAccept)"
                    @click="updateInteraction(contact.id, 'invite-accepted')"
                  >
                    <template #icon>
                      <NmorphIconCheck />
                    </template>
                  </NmorphButton>
                  <NmorphButton
                    height="thin"
                    shape="square"
                    color="var(--nmorph-error-text-color)"
                    :loading="loadingContactIds.has(contact.id)"
                    :aria-label="$t(APP_PAGE_I18N.contactDecline)"
                    @click="updateInteraction(contact.id, 'default')"
                  >
                    <template #icon>
                      <NmorphIconClose />
                    </template>
                  </NmorphButton>
                </template>
              </div>
            </template>
          </AppProfileBasicData>
          <div class="app-navigation-page__contact-actions">
            <NmorphButton
              v-if="contact.interactionType === 'invite-accepted' && getPersonalByContactId(contact.id)"
              shape="square"
              :aria-label="$t(APP_PAGE_I18N.contactWrite)"
              @click="goToChatRoom(getPersonalByContactId(contact.id)?.id)"
            >
              <template #icon>
                <NmorphIconChatLineSquare />
              </template>
            </NmorphButton>
            <NmorphButton
              v-else-if="contact.interactionType === 'invite-accepted'"
              shape="square"
              :loading="creatingChatContactIds.has(contact.id)"
              :aria-label="$t(APP_PAGE_I18N.contactCreateChat)"
              @click="createPrivateChat(contact.id)"
            >
              <template #icon>
                <NmorphIconPlus />
              </template>
            </NmorphButton>
            <NmorphButton
              v-if="contact.interactionType === 'invite-accepted' || contact.interactionType === 'default'"
              shape="square"
              color="var(--nmorph-error-text-color)"
              :aria-label="$t(APP_PAGE_I18N.contactDelete)"
              @click="openDeleteDialog(contact.id)"
            >
              <template #icon>
                <NmorphIconDelete />
              </template>
            </NmorphButton>
          </div>
        </div>
      </div>
    </div>
    <NmorphDialog v-model="isDeleteDialogOpen" :title="$t(APP_PAGE_I18N.contactDeleteTitle)">
      <div class="app-navigation-page__delete-dialog">
        <AppText :text="$t(APP_PAGE_I18N.contactDeleteConfirm)" />
        <div class="app-navigation-page__delete-actions">
          <NmorphButton :text="$t(APP_PAGE_I18N.cancel)" style-type="transparent" @click="contactToDeleteId = ''" />
          <NmorphButton
            color="var(--nmorph-error-text-color)"
            :text="$t(APP_PAGE_I18N.contactDelete)"
            @click="deleteContact"
          />
        </div>
      </div>
    </NmorphDialog>
  </section>
</template>

<style lang="scss">
.app-navigation-page {
  min-height: 0;
}

.app-navigation-page__contacts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-navigation-page__search {
  display: grid;
  gap: 10px;
}

.app-navigation-page__search-results {
  display: grid;
  gap: 8px;

  padding: 10px;
  border-radius: 6px;

  background: var(--app-content-background);
}

.app-navigation-page__found-list,
.app-navigation-page__contact-list {
  display: grid;
  gap: 8px;
}

.app-navigation-page__found-item,
.app-navigation-page__contact-item {
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

.app-navigation-page__load-more {
  justify-self: center;
}

.app-navigation-page__invite-controls,
.app-navigation-page__contact-actions,
.app-navigation-page__delete-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.app-navigation-page__contact-actions {
  flex: 0 0 auto;
}

.app-navigation-page__delete-dialog {
  display: grid;
  gap: 16px;
}

.app-navigation-page__delete-actions {
  justify-content: flex-end;
}
</style>
