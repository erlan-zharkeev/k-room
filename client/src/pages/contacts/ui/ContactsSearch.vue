<script setup lang="ts">
import { NmorphBadge, NmorphCard, NmorphButton, NmorphIconPlusThin, NmorphScroll } from '@nmorph/nmorph-ui-kit'
import { isDefaultContactInteraction } from 'global-shared'

import { useScrollContentNavigation } from 'src/features/scroll-content-navigation'
import { AppHeader, AppProfileBasicData, AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactsSearchEmits, ContactsSearchProps } from '../config/types'
import { useContactSearch } from '../model/use-contact-search.model'

const { loadingContactIds } = defineProps<ContactsSearchProps>()
const emit = defineEmits<ContactsSearchEmits>()
const { saveScrollContentNavigationState } = useScrollContentNavigation('contacts')
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
    <NmorphScroll
      ref="scrollContentNavigation"
      scroll-x-prop="hidden"
      css-scroll-behavior="auto"
      :y-gap-in-px="6"
      update-only-on-scroll-end
      @update:model-value="saveScrollContentNavigationState"
    >
      <div class="contacts-search__scroll-container">
        <div v-if="showSearchResults" class="contacts-search__results">
          <AppHeader tag="h5" :text="$t(CONTACTS_PAGE_I18N.globalSearch)" />
          <AppText
            v-if="isSearchLoading"
            tag="small"
            color="semi-contrast-text"
            :text="$t(CONTACTS_PAGE_I18N.loading)"
          />
          <TransitionGroup
            v-else
            class="contacts-search__list app-list-motion-container"
            name="app-list-motion"
            tag="div"
          >
            <div v-for="contact in foundContactList" :key="contact.id" class="app-list-motion-item">
              <NmorphBadge
                :value="getSearchedContactStatus(contact)"
                hide-on-falsy-value
                size="tiny"
                :color="getSearchedContactStatusColor(contact)"
                type="ribbon"
                ribbon-corner="bottom-left"
              >
                <NmorphCard shadow-type="inset" content-class="contacts-search__item">
                  <AppProfileBasicData :image-id="contact.avatarId" :title="contact.nickname" :name="contact.nickname">
                    <template #title>
                      <div class="contacts-search__name">
                        <AppText truncate :text="contact.nickname" />
                      </div>
                    </template>
                  </AppProfileBasicData>
                  <NmorphButton
                    v-if="isDefaultContactInteraction(contact.interactionType)"
                    shape="square"
                    design="plain"
                    borderless
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
            </div>
            <div v-if="searchHasMore" key="load-more" class="app-list-motion-item">
              <NmorphButton
                :text="$t(CONTACTS_PAGE_I18N.loadMore) + '...'"
                fill
                design="plain"
                borderless
                :loading="isSearchLoadingMore"
                @click="loadMoreSearchedContacts"
              />
            </div>
          </TransitionGroup>
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
  min-width: 0;
}
</style>
