<script setup lang="ts">
import { NmorphTagList } from '@nmorph/nmorph-ui-kit'

import { MESSAGE_REACTION_TAG_COLOR } from '../config/constants'
import type { MessageReactionsProps } from '../config/types'
import { useMessageReactions } from '../model/use-message-reactions.model'

const props = defineProps<MessageReactionsProps>()
const { reactionTagList, reactionTagListKey, selectedReactionGlyphKey } = useMessageReactions(props)
</script>

<template>
  <NmorphTagList
    v-if="reactionTagList.length"
    v-model:selected-value="selectedReactionGlyphKey"
    :key="reactionTagListKey"
    class="message-reactions"
    :model-value="reactionTagList"
    design="common"
    :color="MESSAGE_REACTION_TAG_COLOR"
  />
</template>
