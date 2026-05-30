<script setup lang="ts">
import { NmorphCallout } from '@nmorph/nmorph-ui-kit'

import { AppMediaImage, AppText } from 'src/shared/ui'

import type { MessageLinkPreviewProps } from '../config/types'
import { useMessageLinkPreview } from '../model/use-message-link-preview.model'

const props = defineProps<MessageLinkPreviewProps>()
const { canShowPreview, previewImage, previewTitle } = useMessageLinkPreview(props)
</script>

<template>
  <NmorphCallout
    v-if="canShowPreview"
    class="message-link-preview"
    as="a"
    :href="props.preview.url"
    target="blank"
    rel="noopener noreferrer nofollow ugc"
    referrerpolicy="no-referrer"
    padding="8px"
    border-radius="4px"
    accent-width="2px"
    @click.stop
  >
    <span class="message-link-preview__layout" :class="previewImage && 'message-link-preview__layout--with-image'">
      <span class="message-link-preview__content">
        <AppText tag="small" color="semi-contrast-text" :text="props.preview.host" truncate />
        <AppText :text="previewTitle" bold />
        <AppText
          v-if="props.preview.description"
          tag="small"
          color="semi-contrast-text"
          :text="props.preview.description"
          :line-clamp="2"
        />
      </span>
      <AppMediaImage v-if="previewImage" v-slot="{ src }" :media-id="previewImage.src" :alt="previewImage.name">
        <img v-if="src" class="message-link-preview__image" :src="src" :alt="previewImage.name" />
      </AppMediaImage>
    </span>
  </NmorphCallout>
</template>

<style lang="scss">
.message-link-preview__layout {
  display: grid;
  gap: 8px;
}

.message-link-preview__layout--with-image {
  grid-template-columns: minmax(0, 1fr) auto;
}

.message-link-preview__content {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.message-link-preview__image {
  aspect-ratio: 1;
  width: 72px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
