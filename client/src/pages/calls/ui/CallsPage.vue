<script setup lang="ts">
import { NmorphButton, NmorphIconSearch, NmorphScroll, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CALLS_PAGE_I18N } from '../config/i18n'
import { useCallsPage } from '../model/use-calls-page.model'

import RoomCallHistoryItem from './RoomCallHistoryItem.vue'

const {
  searchQuery,
  roomCallHistoryItems,
  showNoSearchResults,
  showNoCalls,
  searchHasMore,
  isSearchLoading,
  isSearchLoadingMore,
  loadMoreSearchedRoomCalls
} = useCallsPage()
</script>

<template>
  <section class="calls-page">
    <div class="calls-page__toolbar">
      <NmorphTextInput
        v-model="searchQuery"
        clearable
        :placeholder="$t(CALLS_PAGE_I18N.search)"
        :input-attrs="{ 'aria-label': $t(CALLS_PAGE_I18N.search) }"
      >
        <template #prepend-icon>
          <NmorphIconSearch />
        </template>
      </NmorphTextInput>
    </div>

    <AppText v-if="showNoCalls" alignment="center" :selectable="false" :text="$t(CALLS_PAGE_I18N.noCalls)" />
    <AppText v-else-if="isSearchLoading" alignment="center" :selectable="false" :text="$t(CALLS_PAGE_I18N.loading)" />
    <AppText
      v-else-if="showNoSearchResults"
      alignment="center"
      :selectable="false"
      :text="$t(CALLS_PAGE_I18N.noSearchResults)"
    />
    <NmorphScroll v-else scroll-x-prop="hidden" css-scroll-behavior="auto" :y-gap-in-px="0">
      <div class="calls-page__list">
        <RoomCallHistoryItem v-for="item in roomCallHistoryItems" :key="item.id" :item="item" />
        <NmorphButton
          v-if="searchHasMore"
          :text="$t(CALLS_PAGE_I18N.loadMore) + '...'"
          fill
          style-type="transparent"
          :loading="isSearchLoadingMore"
          @click="loadMoreSearchedRoomCalls"
        />
      </div>
    </NmorphScroll>
  </section>
</template>

<style lang="scss">
.calls-page {
  display: flex;
  flex-direction: column;
}

.calls-page__toolbar {
  display: grid;
  gap: 12px;
  padding: 8px;
}

.calls-page__list {
  display: grid;
  gap: 8px;
  padding: 8px;
}
</style>
