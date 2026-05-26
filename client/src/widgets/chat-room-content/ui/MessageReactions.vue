<script setup lang="ts">
import { NmorphTagList } from '@nmorph/nmorph-ui-kit'

import type { MessageReactionsProps } from '../config/types'
import { useMessageReactions } from '../model/use-message-reactions.model'

const props = defineProps<MessageReactionsProps>()
const { reactionTagList, reactionTagListKey, selectMessageReaction } = useMessageReactions(props)
</script>

<template>
  <NmorphTagList
    v-if="reactionTagList.length"
    :key="reactionTagListKey"
    class="message-reactions"
    :model-value="reactionTagList"
    @click="selectMessageReaction"
  />
</template>
