<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphIconSearch, NmorphScroll, NmorphTextInput } from '@nmorph/nmorph-ui-kit'

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
  loadMoreSearchedRoomCalls,
  startRoomCallHistoryItem
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

    <NmorphText v-if="showNoCalls" align="center">{{ $t(CALLS_PAGE_I18N.noCalls) }}</NmorphText>
    <NmorphText v-else-if="isSearchLoading" align="center">{{ $t(CALLS_PAGE_I18N.loading) }}</NmorphText>
    <NmorphText v-else-if="showNoSearchResults" align="center">{{ $t(CALLS_PAGE_I18N.noSearchResults) }}</NmorphText>
    <NmorphScroll v-else scroll-x-prop="hidden" css-scroll-behavior="auto" :y-gap-in-px="0">
      <TransitionGroup class="calls-page__list app-list-motion-container" name="app-list-motion" tag="div">
        <div v-for="item in roomCallHistoryItems" :key="item.id" class="app-list-motion-item">
          <RoomCallHistoryItem :item="item" @start-room-call="startRoomCallHistoryItem" />
        </div>
        <div v-if="searchHasMore" key="load-more" class="app-list-motion-item">
          <NmorphButton
            :text="$t(CALLS_PAGE_I18N.loadMore) + '...'"
            fill
            design="plain"
            borderless
            :loading="isSearchLoadingMore"
            @click="loadMoreSearchedRoomCalls"
          />
        </div>
      </TransitionGroup>
    </NmorphScroll>
  </section>
</template>

<style lang="scss" scoped>
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
