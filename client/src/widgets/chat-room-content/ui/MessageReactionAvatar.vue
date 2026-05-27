<script setup lang="ts">
import { NmorphAvatar } from '@nmorph/nmorph-ui-kit'

import { useLiveMediaUrl } from 'src/shared/lib'
import { AppTooltip } from 'src/shared/ui'

import type { MessageReactionAvatarProps } from '../config/types'

const props = defineProps<MessageReactionAvatarProps>()
const imageSrc = useLiveMediaUrl(() => props.user.avatarId)
</script>

<template>
  <AppTooltip :text="props.user.nickname" position="top" :max-width="180">
    <NmorphAvatar
      class="message-reaction-avatar"
      :src="imageSrc"
      :alt="props.user.nickname"
      :name="props.user.nickname"
      :size="28"
      shape="circle"
    />
  </AppTooltip>
</template>
