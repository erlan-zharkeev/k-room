<script setup lang="ts">
import { NmorphImagePreview } from '@nmorph/nmorph-ui-kit'

import { APP_MEDIA_IMAGE_DEFAULT_PROPS } from './constants'
import type { AppMediaImageProps } from './types'
import { useAppMediaImage } from './use-app-media-image.model'

const props = withDefaults(defineProps<AppMediaImageProps>(), APP_MEDIA_IMAGE_DEFAULT_PROPS)
const { imageSrc } = useAppMediaImage(props)
</script>

<template>
  <slot :src="imageSrc">
    <NmorphImagePreview :src="imageSrc" :alt="props.alt" :width="props.width" :height="props.height" radius="4px" />
  </slot>
</template>
