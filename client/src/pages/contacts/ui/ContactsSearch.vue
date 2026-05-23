<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphButton, NmorphIconPlusThin, NmorphScroll } from '@nmorph/nmorph-ui-kit'
import { buildAvatarId, isDefaultContactInteraction } from 'global-shared'

import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactsSearchEmits, ContactsSearchProps } from '../config/types'
import { useContactSearch } from '../model/use-contact-search.model'

const { loadingContactIds } = defineProps<ContactsSearchProps>()
const emit = defineEmits<ContactsSearchEmits>()
const {
  foundContactList,
  showSearchResults,
  searchHasMore,
  isSearchLoading,
  isSearchLoadingMore,
  getSearchedContactStatus,
  getSearchedContactStatusColor,
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
            <NmorphBadge
              v-for="contact in foundContactList"
              :key="contact.id"
              :value="getSearchedContactStatus(contact)"
              hide-on-falsy-value
              size="tiny"
              :color="getSearchedContactStatusColor(contact)"
              type="ribbon"
              ribbon-corner="bottom-left"
            >
              <NmorphCard shadow-type="inset" content-class="contacts-search__item">
                <AppProfileBasicData
                  :image-id="buildAvatarId(contact.id)"
                  :title="contact.nickname"
                  :name="contact.nickname"
                >
                  <template #title>
                    <div class="contacts-search__name">
                      <AppText truncate :text="contact.nickname" />
                    </div>
                  </template>
                </AppProfileBasicData>
                <NmorphButton
                  v-if="isDefaultContactInteraction(contact.interactionType)"
                  shape="square"
                  :loading="loadingContactIds.has(contact.id)"
                  :aria-label="$t(CONTACTS_PAGE_I18N.add)"
                  @click="emit('add', contact.id)"
                >
                  <template #icon>
                    <NmorphIconPlusThin />
                  </template>
                </NmorphButton>
              </NmorphCard>
            </NmorphBadge>
            <NmorphButton
              v-if="searchHasMore"
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
}

.contacts-search__name {
  flex: 1 1 56px;
  min-width: 0;
}
</style>
