<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphIconPlusThin, NmorphScroll } from '@nmorph/nmorph-ui-kit'
import type { InteractionType } from 'global-shared'
import { computed, toRef, watchEffect } from 'vue'

import { useSyncMedia } from 'src/entities/media-file'
import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactsSearchEmits, IContactsSearchProps } from '../config/types'
import { getContactAvatarId } from '../lib/get-contact-avatar-id'
import { useContactSearch } from '../model/use-contact-search.model'

const props = defineProps<IContactsSearchProps>()
const emit = defineEmits<IContactsSearchEmits>()
const searchQuery = toRef(props, 'searchQuery')
const { sync } = useSyncMedia()

const { searchedContacts, searchHasMore, isSearchLoading, isSearchLoadingMore, loadMoreSearchedContacts } =
  useContactSearch({ searchQuery })

const foundContactList = computed(() => searchedContacts.value.filter(({ id }) => !props.isContactExist(id)))
const hasSearchQuery = computed(() => Boolean(searchQuery.value))
const showSearchResults = computed(
  () => hasSearchQuery.value && (isSearchLoading.value || foundContactList.value.length)
)
const getContactBadgeText = (interactionType: InteractionType) =>
  interactionType === 'blocked' ? CONTACTS_PAGE_I18N.blocked : CONTACTS_PAGE_I18N.invited

watchEffect(() => {
  foundContactList.value.forEach(({ id }) => sync(getContactAvatarId(id)))
})
</script>

<template>
  <div class="contacts-search">
    <NmorphScroll>
      <div class="contacts-search__scroll-container">
        <div v-if="showSearchResults" class="contacts-search__results">
          <AppHeader tag="h5" :text="$t(CONTACTS_PAGE_I18N.globalSearch)" />
          <AppText
            v-if="isSearchLoading"
            tag="small"
            color="semi-contrast-text"
            :text="$t(CONTACTS_PAGE_I18N.loading)"
          />
          <div v-else class="contacts-search__list">
            <div
              v-for="contact in foundContactList"
              :key="contact.id"
              class="contacts-search__item nmorph--shadow-outset"
            >
              <AppProfileBasicData
                avatar-shape="circle"
                :image-id="getContactAvatarId(contact.id)"
                :title="contact.nickname"
                :name="contact.nickname"
              />
              <NmorphButton
                v-if="contact.interactionType === 'default' && !props.isContactExist(contact.id)"
                shape="square"
                :loading="props.loadingContactIds.has(contact.id)"
                :aria-label="$t(CONTACTS_PAGE_I18N.add)"
                @click="emit('add', contact.id)"
              >
                <template #icon>
                  <NmorphIconPlusThin />
                </template>
              </NmorphButton>
              <NmorphBadge v-else is-tag size="tiny" :value="$t(getContactBadgeText(contact.interactionType))" />
            </div>
            <NmorphButton
              v-if="searchHasMore"
              class="contacts-search__load-more"
              :text="$t(CONTACTS_PAGE_I18N.loadMore)"
              fill
              :loading="isSearchLoadingMore"
              @click="loadMoreSearchedContacts"
            />
          </div>
        </div>
        <slot />
      </div>
    </NmorphScroll>
  </div>
</template>

<style lang="scss">
.contacts-search__results {
  display: grid;
  gap: 8px;
}

.contacts-search__list {
  display: grid;
  gap: 8px;
}

.contacts-search__item {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
}
</style>
