<script setup lang="ts">
import { useVirtualizer } from '@tanstack/vue-virtual'
import { type IEventAddReaction, type SocketActionsType } from 'global-shared'
import { Button } from 'primevue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { socket } from 'src/shared/api'
import { EMOJI_LIST, type DbMessageType } from 'src/shared/config'
import { AppEmojiPicker, AppText } from 'src/shared/ui'

import {
  MAIN_PAGE_MESSAGE_ACTIONS,
  MESSAGE_CONTEXT_MENU_HEIGHT_PX,
  MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX,
  MESSAGE_CONTEXT_MENU_WIDTH_PX,
  MESSAGE_LOAD_MORE_SCROLL_TOP_PX,
  MESSAGE_SCROLL_BOTTOM_THRESHOLD_PX,
  MESSAGE_VIRTUAL_ITEM_ESTIMATED_SIZE_PX,
  MESSAGE_VIRTUAL_LIST_OVERSCAN
} from '../config/constants'
import { MAIN_PAGE_I18N } from '../config/i18n'
import { useMessage } from '../model/use-message'
import { useMessageReadObserver } from '../model/use-message-read-observer'
import { useMessageScrollState } from '../model/use-message-scroll-state'

import type { IMessageListProps } from './types'

const { roomId, messages, hasMoreMessages, isLoading, formatRelativeTime } = defineProps<IMessageListProps>()
const emit = defineEmits(['loadMore', 'reply', 'forward', 'delete', 'addReaction'])

const scrollElement = ref<HTMLElement | null>(null)
const messageMenuElement = ref<HTMLElement | null>(null)
const selectedMessage = ref<DbMessageType | null>(null)
const messageMenuPosition = ref({ x: 0, y: 0 })
const roomIdRef = computed(() => roomId)
const messageList = computed(() => messages)
const { user } = useUser()
const { settings } = useSettings()
const { mutate: mutateMessage } = useMessage()
const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(
  computed(() => ({
    count: messageList.value.length,
    getScrollElement: () => scrollElement.value,
    estimateSize: () => MESSAGE_VIRTUAL_ITEM_ESTIMATED_SIZE_PX,
    overscan: MESSAGE_VIRTUAL_LIST_OVERSCAN,
    getItemKey: (index) => messageList.value[index]?.id ?? index
  }))
)
const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const lastMessage = computed(() => {
  const lastMessageIndex = messageList.value.length - 1

  return messageList.value[lastMessageIndex]
})
const lastMessageId = computed(() => {
  return lastMessage.value?.id
})

const { getScrollState, persistScrollState, restoreScrollState, schedulePersistScrollState } = useMessageScrollState(
  messageList,
  scrollElement,
  virtualizer
)
const { observeMessageElement } = useMessageReadObserver(roomIdRef, messageList, scrollElement)
const loadAnchor = ref<ReturnType<typeof getScrollState> | null>(null)
const pendingRestoreRoomId = ref(roomId)
const isRestoringScroll = ref(false)
const wasScrolledToBottom = ref(true)

const getMessageMenuPosition = ({ clientX, clientY }: Pick<MouseEvent, 'clientX' | 'clientY'>) => ({
  x: Math.max(
    MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX,
    Math.min(clientX, window.innerWidth - MESSAGE_CONTEXT_MENU_WIDTH_PX - MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX)
  ),
  y: Math.max(
    MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX,
    Math.min(clientY, window.innerHeight - MESSAGE_CONTEXT_MENU_HEIGHT_PX - MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX)
  )
})

const closeMessageMenu = () => {
  selectedMessage.value = null
}

const openMessageMenu = (message: DbMessageType, event: MouseEvent) => {
  selectedMessage.value = message
  messageMenuPosition.value = getMessageMenuPosition(event)
}

const isOwnReaction = (message: DbMessageType, glyphKey: string) => {
  return message.reactions?.some(
    ({ authorId, glyphKey: reactionGlyphKey }) => authorId === user.value.id && reactionGlyphKey === glyphKey
  )
}

const isSelectedMessageReaction = (glyphKey: string) => {
  return selectedMessage.value ? isOwnReaction(selectedMessage.value, glyphKey) : false
}

const getReactionGlyph = (glyphKey: string) => EMOJI_LIST.find(({ key }) => key === glyphKey)?.glyph ?? glyphKey

const addReaction = async (glyphKey: string) => {
  const message = selectedMessage.value
  const { id: authorId, username } = user.value

  if (!message || !authorId || isSelectedMessageReaction(glyphKey)) return

  const reaction = {
    authorId,
    username,
    glyphKey
  }
  const payload: IEventAddReaction = {
    glyphKey,
    messageId: message.id,
    roomId,
    username
  }

  await mutateMessage(message.id, (nextMessage) => {
    const reactions = nextMessage.reactions ?? []
    const isExistingReaction = reactions.some(
      ({ authorId: reactionAuthorId, glyphKey: reactionGlyphKey }) =>
        reactionAuthorId === authorId && reactionGlyphKey === glyphKey
    )

    if (isExistingReaction) return

    nextMessage.reactions = [...reactions, reaction]
  })

  socket.emit<SocketActionsType>('add-reaction', payload)
  emit('addReaction', payload)
  closeMessageMenu()
}

const handleMessageAction = (actionId: (typeof MAIN_PAGE_MESSAGE_ACTIONS)[number]['id']) => {
  const message = selectedMessage.value

  if (!message) return

  emit(actionId, message)
  closeMessageMenu()
}

const handleWindowClick = (event: MouseEvent) => {
  const { target } = event

  if (target instanceof Node && messageMenuElement.value?.contains(target)) return

  closeMessageMenu()
}

const handleWindowKeydown = ({ key }: KeyboardEvent) => {
  if (key === 'Escape') {
    closeMessageMenu()
  }
}

const isScrolledToBottom = () => {
  const element = scrollElement.value

  if (!element) return true

  return element.scrollHeight - element.scrollTop - element.clientHeight <= MESSAGE_SCROLL_BOTTOM_THRESHOLD_PX
}

const scrollToBottom = async () => {
  if (!messageList.value.length) return

  await nextTick()
  virtualizer.value.scrollToIndex(messageList.value.length - 1, { align: 'end' })
}

const restorePendingRoomState = async () => {
  if (pendingRestoreRoomId.value !== roomId || !messageList.value.length) return false

  isRestoringScroll.value = true

  const isRestored = await restoreScrollState(roomId)

  pendingRestoreRoomId.value = ''

  if (!isRestored) {
    await scrollToBottom()
  }

  await nextTick()
  isRestoringScroll.value = false

  return true
}

const loadPreviousMessages = () => {
  loadAnchor.value = getScrollState()
  emit('loadMore')
}

const handleScroll = () => {
  closeMessageMenu()

  if (roomId) {
    schedulePersistScrollState(roomId)
  }

  if ((scrollElement.value?.scrollTop ?? 0) <= MESSAGE_LOAD_MORE_SCROLL_TOP_PX && hasMoreMessages && !isLoading) {
    loadPreviousMessages()
  }
}

const setMessageElement = (element: Element | ComponentPublicInstance | null, messageId: string) => {
  const htmlElement = element instanceof HTMLElement ? element : null

  virtualizer.value.measureElement(htmlElement)
  observeMessageElement(htmlElement, messageId)
}

watch(
  roomIdRef,
  async (nextRoomId, previousRoomId) => {
    if (previousRoomId) {
      await persistScrollState(previousRoomId)
    }

    pendingRestoreRoomId.value = nextRoomId
    await nextTick()
    await restorePendingRoomState()
  },
  { flush: 'post' }
)

watch(
  () => messageList.value.length,
  async () => {
    if (loadAnchor.value) {
      await nextTick()
      await restoreScrollState(roomId, loadAnchor.value)
      loadAnchor.value = null
      return
    }

    await restorePendingRoomState()
  },
  { flush: 'post' }
)

watch(
  lastMessageId,
  () => {
    wasScrolledToBottom.value = isScrolledToBottom()
  },
  { flush: 'pre' }
)

watch(lastMessageId, async (_, previousMessageId) => {
  if (isRestoringScroll.value || pendingRestoreRoomId.value === roomId) return

  if (!previousMessageId || wasScrolledToBottom.value || lastMessage.value?.isSelf) {
    await scrollToBottom()
  }
})

onMounted(() => {
  window.addEventListener('click', handleWindowClick)
  window.addEventListener('keydown', handleWindowKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleWindowClick)
  window.removeEventListener('keydown', handleWindowKeydown)

  if (roomId) {
    void persistScrollState(roomId)
  }
})
</script>

<template>
  <div ref="scrollElement" class="message-list" @scroll="handleScroll">
    <Button
      v-if="hasMoreMessages"
      class="message-list__load-more"
      :disabled="isLoading"
      :label="$t(MAIN_PAGE_I18N.loadMore)"
      size="small"
      text
      @click="loadPreviousMessages"
    />

    <div v-if="messages.length" class="message-list__inner" :style="{ height: `${totalSize}px` }">
      <template v-for="virtualRow in virtualRows" :key="virtualRow.key">
        <article
          v-if="messages[virtualRow.index]"
          :ref="(element) => setMessageElement(element, messages[virtualRow.index].id)"
          class="message-list__item"
          :class="{ 'message-list__item--self': messages[virtualRow.index].isSelf }"
          :data-index="virtualRow.index"
          :style="{ transform: `translateY(${virtualRow.start}px)` }"
        >
          <div
            class="message-list__message"
            @contextmenu.prevent.stop="openMessageMenu(messages[virtualRow.index], $event)"
          >
            <AppText
              class="message-list__author"
              bold
              color="contrast-color"
              :text="messages[virtualRow.index].authorName"
            />
            <AppText
              class="message-list__body"
              tag="p"
              color="contrast-color"
              :text="messages[virtualRow.index].body"
            />
            <div v-if="messages[virtualRow.index].reactions?.length" class="message-list__reactions">
              <span
                v-for="(reaction, reactionIndex) in messages[virtualRow.index].reactions"
                :key="`${reaction.glyphKey}-${reaction.authorId}-${reactionIndex}`"
                class="message-list__reaction"
              >
                {{ getReactionGlyph(reaction.glyphKey) }}
              </span>
            </div>
            <AppText
              class="message-list__time"
              size="small"
              :text="formatRelativeTime(messages[virtualRow.index].createdAt)"
            />
          </div>
        </article>
      </template>
    </div>

    <AppText v-else class="message-list__empty" tag="p" :text="$t(MAIN_PAGE_I18N.noMessages)" />

    <div
      v-if="selectedMessage"
      ref="messageMenuElement"
      class="message-list__context-menu"
      :aria-label="$t(MAIN_PAGE_I18N.messageActions)"
      role="menu"
      :style="{ left: `${messageMenuPosition.x}px`, top: `${messageMenuPosition.y}px` }"
      @click.stop
      @contextmenu.prevent.stop
    >
      <AppEmojiPicker
        class="message-list__context-picker"
        :expand-label="$t(MAIN_PAGE_I18N.expandEmojiPicker)"
        :language="settings.language"
        @select="addReaction"
      />
      <Button v-for="action in MAIN_PAGE_MESSAGE_ACTIONS"
        :key="action.id"
        class="message-list__context-action"         @click="handleMessageAction(action.id)"
        :label="$t(action.label)"
        :severity="action.severity ?? 'secondary'"
        :icon="action.icon"
  ></Button>

    </div>
  </div>
</template>

<style>
.message-list {
  scrollbar-color: var(--p-app-text-muted) var(--p-content-background);
  scrollbar-gutter: stable;

  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;

  min-height: 0;
  padding-right: 18px;
}

.message-list::-webkit-scrollbar {
  width: 14px;
}

.message-list::-webkit-scrollbar-track {
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  background: var(--p-content-background);
}

.message-list::-webkit-scrollbar-thumb {
  border: 3px solid var(--p-content-background);
  border-radius: 8px;
  background: var(--p-app-text-muted);
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: var(--p-app-text-semi-contrast);
}

.message-list__load-more {
  position: sticky;
  z-index: 1;
  top: 0;

  justify-self: center;

  background: var(--p-content-background);
}

.message-list__inner {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  margin-top: auto;
}

.message-list__item {
  position: absolute;
  top: 0;
  left: 0;

  display: grid;

  width: 100%;
  padding-bottom: 8px;
}

.message-list__item--self {
  justify-items: end;
}

.message-list__message {
  cursor: context-menu;

  display: grid;
  gap: 4px;

  width: min(520px, 82%);
  padding: 10px 12px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-app-muted-background);
}

.message-list__item--self .message-list__message {
  border-color: var(--p-primary-color);
}

.message-list__body {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-list__time {
  justify-self: end;
}

.message-list__reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.message-list__reaction {
  display: grid;
  place-items: center;

  min-width: 24px;
  min-height: 24px;
  padding: 2px 6px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  font-size: 16px;
  line-height: 1;

  background: var(--p-content-background);
}

.message-list__context-menu {
  position: fixed;
  z-index: 30;

  display: grid;
  gap: 4px;

  width: 340px;
  padding: 8px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  color: var(--p-app-text-contrast);

  background: var(--p-content-background);
  box-shadow: 0 16px 40px var(--p-app-shadow-outset-start);
}

.message-list__context-picker {
  margin-bottom: 4px;
  border-bottom: 1px solid var(--p-content-border-color);
}

.message-list__context-action {
  cursor: pointer;
  border: 0;
  color: inherit;
  background: transparent;
}

.message-list__context-action {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 10px;
  align-items: center;

  min-height: 36px;
  padding: 8px;
  border-radius: 6px;

  font: inherit;
  text-align: left;
}

.message-list__context-action span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-list__context-action:hover {
  background: var(--p-app-muted-background);
}

.message-list__empty {
  padding: 12px;
}
</style>
