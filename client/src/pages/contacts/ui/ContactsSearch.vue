<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphIconPlusThin, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { CONTACTS_SEARCH_BADGE_BY_INTERACTION } from '../config/constants'
import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactsSearchEmits, IContactsSearchProps } from '../config/types'
import { getContactAvatarId } from '../lib/get-contact-avatar-id'
import { useContactSearch } from '../model/use-contact-search.model'

const { loadingContactIds } = defineProps<IContactsSearchProps>()
const emit = defineEmits<IContactsSearchEmits>()
const {
  foundContactList,
  showSearchResults,
  searchHasMore,
  isSearchLoading,
  isSearchLoadingMore,
  loadMoreSearchedContacts
} = useContactSearch()
</script>

<template>
  <div class="contacts-search">
    <NmorphScroll scroll-x-prop="hidden">
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
              class="contacts-search__item nmorph--shadow-inset"
            >
              <AppProfileBasicData
                class="contacts-search__profile"
                avatar-shape="circle"
                :image-id="getContactAvatarId(contact.id)"
                :title="contact.nickname"
                :name="contact.nickname"
              >
                <template #title>
                  <div class="contacts-search__title">
                    <div class="contacts-search__name">
                      <AppText truncate :text="contact.nickname" />
                    </div>
                    <NmorphBadge
                      v-if="CONTACTS_SEARCH_BADGE_BY_INTERACTION[contact.interactionType].visible"
                      class="contacts-search__status"
                      is-tag
                      size="tiny"
                      :color="CONTACTS_SEARCH_BADGE_BY_INTERACTION[contact.interactionType].color"
                      :value="$t(CONTACTS_SEARCH_BADGE_BY_INTERACTION[contact.interactionType].label)"
                    />
                  </div>
                </template>
              </AppProfileBasicData>
              <div class="contacts-search__actions">
                <NmorphButton
                  v-if="contact.interactionType === 'default'"
                  shape="square"
                  :loading="loadingContactIds.has(contact.id)"
                  :aria-label="$t(CONTACTS_PAGE_I18N.add)"
                  @click="emit('add', contact.id)"
                >
                  <template #icon>
                    <NmorphIconPlusThin />
                  </template>
                </NmorphButton>
              </div>
            </div>
            <NmorphButton
              v-if="searchHasMore"
              class="contacts-search__load-more"
              :text="$t(CONTACTS_PAGE_I18N.loadMore) + '...'"
              fill
              style-type="transparent"
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
.contacts-search__scroll-container {
  display: grid;
  gap: 8px;
  padding: 0 12px 0 4px;
}

.contacts-search__results {
  display: grid;
  gap: 8px;
}

.contacts-search__list {
  display: grid;
  gap: 8px;
}

.contacts-search__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 8px;
  align-items: center;

  padding: 8px;
}

.contacts-search__name {
  flex: 1 1 56px;
  min-width: 0;
}
</style>
