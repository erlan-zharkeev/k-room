<script setup lang="ts">
import { NmorphText, NmorphButton, NmorphDropdown, NmorphTagList } from '@nmorph/nmorph-ui-kit'

import type { MessageReactionsProps } from '../config/types'
import { useMessageReactions } from '../model/use-message-reactions.model'

import MessageReactionAvatar from './MessageReactionAvatar.vue'

const props = defineProps<MessageReactionsProps>()
const {
  closeReactionDropdown,
  hasHiddenReactionGroups,
  hiddenReactionGroupsCount,
  isReactionDropdownOpen,
  reactionDetailsList,
  reactionList,
  reactionsDropdownAnchor,
  selectMessageReaction,
  toggleReactionDropdown
} = useMessageReactions(props)
</script>

<template>
  <div v-if="reactionList.length" class="message-reactions">
    <NmorphTagList
      class="message-reactions__list"
      :model-value="reactionList"
      design="plain"
      color="var(--app-muted-surface-soft)"
      @click="selectMessageReaction"
    >
      <template #item="{ item: reaction }">
        <span class="message-reactions__glyph">{{ reaction.glyphKey }}</span>
        <NmorphText
          v-if="reaction.count > 1"
          class="message-reactions__count"
          as="small"
          color="var(--nmorph-contrast-text-color)"
          no-line-height
          variant="body-small"
          >{{ reaction.count }}</NmorphText
        >
        <span class="message-reactions__avatars">
          <span
            v-for="reactionUser in reaction.visibleUsers"
            :key="reactionUser.authorId"
            class="message-reactions__avatar"
          >
            <MessageReactionAvatar :user="reactionUser" />
          </span>
        </span>
      </template>
    </NmorphTagList>
    <span v-if="hasHiddenReactionGroups" ref="reactionsDropdownAnchor" class="message-reactions__more-anchor">
      <NmorphButton
        class="message-reactions__more"
        design="plain"
        borderless
        color="var(--nmorph-accent-color)"
        :text="`+${hiddenReactionGroupsCount}`"
        @click.stop="toggleReactionDropdown"
      />
    </span>
    <NmorphDropdown
      v-if="hasHiddenReactionGroups && reactionsDropdownAnchor"
      :open="isReactionDropdownOpen"
      :relative-element="reactionsDropdownAnchor"
      placement="top-start"
      role="dialog"
      :width="220"
      :max-width="260"
      :fill-width="false"
      :restore-focus="false"
      hide-shadow
      @on-outside-click="closeReactionDropdown"
      @on-escape-keydown="closeReactionDropdown"
    >
      <div class="message-reactions__details">
        <div v-for="reaction in reactionDetailsList" :key="reaction.id" class="message-reactions__detail">
          <span class="message-reactions__detail-glyph">{{ reaction.glyphKey }}</span>
          <NmorphText class="message-reactions__detail-name" truncate>{{ reaction.user.nickname }}</NmorphText>
        </div>
      </div>
    </NmorphDropdown>
  </div>
</template>

<style lang="scss">
.message-reactions {
  overflow: hidden;
  display: inline-flex;
  flex: 1 1 auto;
  gap: 4px;
  align-items: center;

  max-width: 260px;
  height: 28px;
  margin-right: auto;
}

.message-reactions__list.nmorph-list {
  overflow: hidden;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;

  min-width: 0;
  height: 28px;
}

.message-reactions__list .nmorph-tag-item {
  cursor: pointer;

  flex: 0 0 auto;

  height: 28px;
  margin-right: 0;
  padding: 2px 5px;
  border-radius: 999px;
}

.message-reactions__list .nmorph-tag-item:hover {
  filter: brightness(1.12);
}

.message-reactions__more-anchor {
  display: inline-flex;
  flex: 0 0 auto;
}

.message-reactions__more.nmorph-button {
  height: 28px;
  min-height: 28px;
}

.message-reactions__more .nmorph-button__content {
  padding: 0 4px;
}

.message-reactions__list .message-reactions__avatars {
  transform: none;
  display: inline-flex;
  align-items: center;
  margin-left: 3px;
}

.message-reactions__list .message-reactions__avatar {
  position: relative;
  transform: none;

  display: inline-flex;
  flex: 0 0 16px;

  min-width: 0;

  .nmorph-image {
    padding: 0;
  }
}

.message-reactions__avatar:last-child {
  flex-basis: 22px;
}

.message-reactions__avatar .nmorph-avatar__initials {
  transform: none;
}

.message-reactions__avatar:not(:first-child) {
  z-index: 1;
}

.message-reactions__tooltip {
  display: flex;
  align-items: center;
}

.message-reactions__details {
  overflow-y: auto;
  display: grid;
  gap: 4px;

  max-height: 260px;
  padding: 8px;
}

.message-reactions__detail {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px;
  align-items: center;
}
</style>
