<script setup lang="ts">
import { NmorphLink } from '@nmorph/nmorph-ui-kit'

import { MESSAGE_TEXT_SEGMENT_KIND } from '../config/constants'
import type { MessageTextProps } from '../config/types'
import { useMessageText } from '../model/use-message-text.model'

const props = defineProps<MessageTextProps>()
const { segments } = useMessageText(props)
</script>

<template>
  <div class="message-text">
    <template v-for="segment in segments" :key="segment.id">
      <NmorphLink
        v-if="segment.kind === MESSAGE_TEXT_SEGMENT_KIND.LINK"
        class="message-text__link"
        :href="segment.href"
        target="blank"
        rel="noopener noreferrer nofollow ugc"
        referrerpolicy="no-referrer"
        @click.stop
      >
        {{ segment.text }}
      </NmorphLink>
      <span v-else>{{ segment.text }}</span>
    </template>
  </div>
</template>
