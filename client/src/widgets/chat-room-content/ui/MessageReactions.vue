<script setup lang="ts">
import { AppText } from 'src/shared/ui'

import type { MessageReactionsProps } from '../config/types'
import { useMessageReactions } from '../model/use-message-reactions.model'

import MessageReactionAvatar from './MessageReactionAvatar.vue'

const props = defineProps<MessageReactionsProps>()
const { reactionList, selectMessageReaction } = useMessageReactions(props)
</script>

<template>
  <div v-if="reactionList.length" class="message-reactions">
    <div
      v-for="reaction in reactionList"
      :key="reaction.glyphKey"
      class="message-reactions__item"
      role="button"
      tabindex="0"
      :style="{
        '--message-reaction-background': reaction.isSelected
          ? 'var(--app-accent-surface-soft)'
          : 'var(--app-muted-surface-soft)'
      }"
      @click="selectMessageReaction(reaction.glyphKey)"
      @keydown.enter="selectMessageReaction(reaction.glyphKey)"
      @keydown.space.prevent="selectMessageReaction(reaction.glyphKey)"
    >
      <span class="message-reactions__glyph">{{ reaction.glyphKey }}</span>
      <AppText
        v-if="reaction.count > 1"
        class="message-reactions__count"
        tag="small"
        color="contrast-text"
        :text="reaction.count"
        no-line-height
      />
      <span class="message-reactions__avatars">
        <span
          v-for="reactionUser in reaction.visibleUsers"
          :key="reactionUser.authorId"
          class="message-reactions__avatar"
        >
          <MessageReactionAvatar :user="reactionUser" />
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.message-reactions__item {
  cursor: pointer;
  user-select: none;

  display: inline-flex;
  gap: 3px;
  align-items: center;

  min-height: 24px;
  padding: 2px 5px;
  border-radius: 999px;

  color: var(--nmorph-contrast-text-color);

  background: var(--message-reaction-background);
}

.message-reactions__item:hover {
  filter: brightness(1.12);
}

.message-reactions__item:focus-visible {
  outline: 2px solid var(--nmorph-accent-color);
  outline-offset: 2px;
}

.message-reactions__avatars {
  display: inline-flex;
  align-items: center;
  margin-left: 3px;
}

.message-reactions__avatar {
  width: 22px;
}

.message-reactions__avatar:last-child {
  width: 28px;
}
</style>
