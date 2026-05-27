<script setup lang="ts">
import { NmorphTagList } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import type { MessageReactionsProps } from '../config/types'
import { useMessageReactions } from '../model/use-message-reactions.model'

import MessageReactionAvatar from './MessageReactionAvatar.vue'

const props = defineProps<MessageReactionsProps>()
const { reactionList, selectMessageReaction } = useMessageReactions(props)
</script>

<template>
  <NmorphTagList
    v-if="reactionList.length"
    class="message-reactions"
    :model-value="reactionList"
    design="common"
    color="var(--app-muted-surface-soft)"
    @click="selectMessageReaction"
  >
    <template #item="{ item: reaction }">
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
    </template>
  </NmorphTagList>
</template>

<style lang="scss">
.message-reactions.nmorph-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.message-reactions .nmorph-tag-item {
  cursor: pointer;

  height: 28px;
  margin-right: 0;
  padding: 2px 5px;
  border-radius: 999px;
}

.message-reactions .nmorph-tag-item:hover {
  filter: brightness(1.12);
}

.message-reactions__avatars {
  display: inline-flex;
  align-items: center;
  margin-left: 3px;
}

.message-reactions__avatar {
  position: relative;
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

.message-reactions__avatar:not(:first-child) {
  z-index: 1;
}

.message-reactions__tooltip {
  display: flex;
  align-items: center;
}
</style>
