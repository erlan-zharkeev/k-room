<script setup lang="ts">
import { NmorphAvatar, NmorphTooltip } from '@nmorph/nmorph-ui-kit'

import { useLiveMediaUrl } from 'src/shared/lib'

import type { MessageReactionAvatarProps } from '../config/types'

const props = defineProps<MessageReactionAvatarProps>()
const imageSrc = useLiveMediaUrl(() => props.user.avatarId)
</script>

<template>
  <NmorphTooltip
    :text="props.user.nickname"
    position="top"
    :max-width="180"
    touch="disable"
    class="message-reactions__tooltip"
  >
    <NmorphAvatar
      :src="imageSrc"
      :alt="props.user.nickname"
      :name="props.user.nickname"
      :size="20"
      design="plain"
      shape="circle"
    />
  </NmorphTooltip>
</template>
