<script setup lang="ts">
import { USER_ENDPOINTS } from 'global-shared'
import { Button, InputText, Message, Password, Select, ToggleSwitch } from 'primevue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useMedia } from 'src/entities/media-file'
import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'
import { MAIN_PAGE_ROUTES } from 'src/widgets/main-left-bar/config/constants'
import { ThemeSettings } from 'src/widgets/theme-settings'

import { SoundType, ThemeType, CustomThemeColorType } from '../../../shared/config'
import { MAIN_PAGE_SETTINGS_ITEMS, MAIN_PAGE_LANGUAGE_OPTIONS, MAIN_PAGE_WALLPAPER_ITEMS, MAIN_PAGE_I18N, getMainPageSettingsPath, MAIN_PAGE_SOUND_ITEMS } from '../../main'

import type { MediaDeviceKindType } from './types'


const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { media, put: putMedia, remove: removeMedia } = useMedia()
const { user, shallowUpdate: updateUserData } = useUser()
const { doRequest } = useApi()
const { settings, selectedWallpaper, setByPath, shallowUpdate } = useSettings()

const selectedSettingsId = ref('account')
const accountUsername = ref('')
const accountAvatarFile = ref<File>()
const accountAvatarPreviewUrl = ref('')
const accountAvatarWasReset = ref(false)
const isAccountSaving = ref(false)
const currentPassword = ref('')
const nextPassword = ref('')
const repeatPassword = ref('')
const isPasswordChanging = ref(false)
const mediaDevices = ref<MediaDeviceInfo[]>([])
const playingSoundId = ref<SoundType | ''>('')
const audioInputLevel = ref(0)
const isTestingAudioInput = ref(false)
const isTestingVideoInput = ref(false)
const isTestingAudioOutput = ref(false)
const videoPreviewElement = ref<HTMLVideoElement>()
let accountAvatarPreviewObjectUrl: string | undefined
let audioInputStream: MediaStream | undefined
let audioInputContext: AudioContext | undefined
let audioInputAnimationFrame: number | undefined
let videoInputStream: MediaStream | undefined
let audioOutputTest: HTMLAudioElement | undefined
let previewAudio: HTMLAudioElement | undefined

const selectedSettingsItem = computed(
  () => MAIN_PAGE_SETTINGS_ITEMS.find((item) => item.id === selectedSettingsId.value) ?? MAIN_PAGE_SETTINGS_ITEMS[0]
)

const userAvatarId = computed(() => (user.value.id ? `avatar.${user.value.id}` : ''))
const userAvatarRecord = computed(() => media.value.find((item) => item.id === userAvatarId.value))
const userAvatarUrl = ref('')
const accountAvatarUrl = computed(() =>
  accountAvatarWasReset.value ? '' : accountAvatarPreviewUrl.value || userAvatarUrl.value
)
const passwordMismatch = computed(() => Boolean(repeatPassword.value && nextPassword.value !== repeatPassword.value))
const isPasswordSubmitDisabled = computed(
  () => !currentPassword.value || !nextPassword.value || !repeatPassword.value || passwordMismatch.value
)


const isDefaultWallpaperVisible = computed(
  () => settings.value.showWallpaper && settings.value.wallpaper === 'default' && Boolean(selectedWallpaper.value)
)

const widgetWallpaperStyle = computed(() => {
  if (!settings.value.showWallpaper || !selectedWallpaper.value) return undefined

  if (settings.value.wallpaper === 'default') {
    return {
      '--main-page-widget-wallpaper': `url(${selectedWallpaper.value})`,
      '--main-layout-wallpaper-pseudo-display': isDefaultWallpaperVisible.value ? 'block' : 'none'
    }
  }

  return {
    backgroundImage: `linear-gradient(var(--p-app-widget-background, var(--p-content-background)), var(--p-app-widget-background, var(--p-content-background))), url(${selectedWallpaper.value})`
  }
})

const getMediaDeviceOptions = (kind: MediaDeviceKindType) =>
  computed(() => [
    {
      label: t(MAIN_PAGE_I18N.defaultDevice),
      value: ''
    },
    ...mediaDevices.value
      .filter((device) => device.kind === kind)
      .map((device, index) => ({
        label: device.label || `${t(MAIN_PAGE_I18N.defaultDevice)} ${index + 1}`,
        value: device.deviceId
      }))
  ])

const audioInputDeviceOptions = getMediaDeviceOptions('audioinput')
const videoInputDeviceOptions = getMediaDeviceOptions('videoinput')
const audioOutputDeviceOptions = getMediaDeviceOptions('audiooutput')

const isSettingsId = (settingsId: unknown): settingsId is (typeof MAIN_PAGE_SETTINGS_ITEMS)[number]['id'] =>
  typeof settingsId === 'string' && MAIN_PAGE_SETTINGS_ITEMS.some(({ id }) => id === settingsId)

const syncSelectedSettingsWithRoute = () => {
  const { settingsId } = route.params

  selectedSettingsId.value = isSettingsId(settingsId) ? settingsId : 'account'
}

const updateSelectedSettings = async (settingsId: string) => {
  selectedSettingsId.value = settingsId
  await router.push(getMainPageSettingsPath(settingsId))

  if (settingsId === 'devices') {
    refreshMediaDevices()
  }
}

const changeLanguage = async (language: unknown) => {
  if (language !== 'en' && language !== 'ru' && language !== 'zh') return

  await setByPath('language', language)
}

const changeTheme = async (theme: ThemeType) => {
  await setByPath('theme', theme)
}

const changeCustomThemeColor = async (colorName: CustomThemeColorType, value: string) => {
  await setByPath(`customTheme.${colorName}`, value)
}

const clearAccountAvatarPreview = () => {
  if (accountAvatarPreviewObjectUrl) {
    URL.revokeObjectURL(accountAvatarPreviewObjectUrl)
  }

  accountAvatarPreviewObjectUrl = undefined
  accountAvatarPreviewUrl.value = ''
}

const uploadAccountAvatar = (event: Event) => {
  const { files } = event.target as HTMLInputElement
  const file = files?.[0]

  if (!file) return

  clearAccountAvatarPreview()
  accountAvatarFile.value = file
  accountAvatarWasReset.value = false
  accountAvatarPreviewObjectUrl = URL.createObjectURL(file)
  accountAvatarPreviewUrl.value = accountAvatarPreviewObjectUrl
}

const resetAccountAvatar = () => {
  accountAvatarFile.value = undefined
  accountAvatarWasReset.value = true
  clearAccountAvatarPreview()
}

const saveAccount = async () => {
  const username = accountUsername.value.trim()

  if (!user.value.id || !username) return

  const avatarId = userAvatarId.value
  const formData = new FormData()

  formData.append('username', username)
  formData.append('reset-avatar', accountAvatarWasReset.value ? 'reset' : '')

  if (accountAvatarFile.value) {
    formData.append('file', accountAvatarFile.value)
  }

  try {
    isAccountSaving.value = true
    await doRequest<null>('patch', USER_ENDPOINTS.editUserData, formData, {
      contentType: 'multipart/form-data'
    })
    await updateUserData({ username })

    if (avatarId && accountAvatarWasReset.value) {
      await removeMedia(avatarId)
    }

    if (avatarId && accountAvatarFile.value) {
      await putMedia({
        id: avatarId,
        blob: accountAvatarFile.value,
        contentType: accountAvatarFile.value.type,
        etag: `${Date.now()}`,
        kind: 'image',
        lastModified: new Date().toUTCString(),
        lastChecked: Date.now()
      })
    }

    accountAvatarFile.value = undefined
    accountAvatarWasReset.value = false
    clearAccountAvatarPreview()
  } finally {
    isAccountSaving.value = false
  }
}

const changePassword = async () => {
  if (isPasswordSubmitDisabled.value) return

  try {
    isPasswordChanging.value = true
    await doRequest<null>('patch', USER_ENDPOINTS.changePassword, {
      currentPassword: currentPassword.value,
      password: nextPassword.value
    })
    currentPassword.value = ''
    nextPassword.value = ''
    repeatPassword.value = ''
  } finally {
    isPasswordChanging.value = false
  }
}

const updateWallpaperVisibility = async (showWallpaper: boolean) => {
  await shallowUpdate({ showWallpaper })
}

const updateWallpaper = async (wallpaper: 'default' | 'custom') => {
  await shallowUpdate({ wallpaper })
}

const uploadWallpaper = async (event: Event) => {
  const { files } = event.target as HTMLInputElement
  const file = files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.addEventListener('load', async () => {
    if (typeof reader.result !== 'string') return

    await shallowUpdate({
      customWallpaperDataUrl: reader.result,
      wallpaper: 'custom',
      showWallpaper: true
    })
  })
  reader.readAsDataURL(file)
}

const updateNotificationVisibility = async (showNotification: boolean) => {
  await shallowUpdate({ showNotification })
}

const updateSound = async (soundOn: boolean) => {
  await shallowUpdate({ soundOn })
}

const updateSoundValue = async (sound: SoundType) => {
  await shallowUpdate({ sound, soundOn: true })
}

const getSoundSrc = (sound: SoundType, fallbackSrc: string) => settings.value.customSounds?.[sound] || fallbackSrc

const stopPreviewSound = () => {
  if (previewAudio) {
    previewAudio.pause()
    previewAudio.currentTime = 0
  }

  previewAudio = undefined
  playingSoundId.value = ''
}

const setAudioOutput = async (audio: HTMLAudioElement) => {
  if (settings.value.selectedAudioOutputDeviceId && typeof audio.setSinkId === 'function') {
    await audio.setSinkId(settings.value.selectedAudioOutputDeviceId)
  }
}

const previewSound = async (sound: SoundType, src: string) => {
  if (playingSoundId.value === sound) {
    stopPreviewSound()
    return
  }

  stopPreviewSound()

  const audio = new Audio(getSoundSrc(sound, src))
  previewAudio = audio
  playingSoundId.value = sound

  await setAudioOutput(audio)
  audio.addEventListener('ended', stopPreviewSound, { once: true })
  audio.play().catch(stopPreviewSound)
}

const uploadSound = async (sound: SoundType, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.addEventListener('load', async () => {
    if (typeof reader.result !== 'string') return

    await shallowUpdate({
      customSounds: {
        ...settings.value.customSounds,
        [sound]: reader.result
      },
      sound,
      soundOn: true
    })
    input.value = ''
  })
  reader.readAsDataURL(file)
}

const restoreDefaultSound = async (sound: SoundType) => {
  if (playingSoundId.value === sound) {
    stopPreviewSound()
  }

  await shallowUpdate({
    customSounds: {
      ...settings.value.customSounds,
      [sound]: ''
    }
  })
}

const hasCustomSound = (sound: SoundType) => Boolean(settings.value.customSounds?.[sound])

const refreshMediaDevices = async () => {
  if (!navigator.mediaDevices?.enumerateDevices) {
    mediaDevices.value = []
    return
  }

  try {
    mediaDevices.value = await navigator.mediaDevices.enumerateDevices()
  } catch {
    mediaDevices.value = []
  }
}

const stopAudioInputTest = () => {
  audioInputStream?.getTracks().forEach((track) => track.stop())
  audioInputStream = undefined

  if (audioInputAnimationFrame) {
    cancelAnimationFrame(audioInputAnimationFrame)
  }

  audioInputContext?.close()
  audioInputContext = undefined
  audioInputLevel.value = 0
  isTestingAudioInput.value = false
}

const startAudioInputTest = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: settings.value.selectedAudioInputDeviceId
        ? { exact: settings.value.selectedAudioInputDeviceId }
        : undefined
    }
  })
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  const data = new Uint8Array(analyser.frequencyBinCount)

  analyser.fftSize = 256
  source.connect(analyser)
  audioInputStream = stream
  audioInputContext = context
  isTestingAudioInput.value = true
  await refreshMediaDevices()

  const updateLevel = () => {
    analyser.getByteFrequencyData(data)
    audioInputLevel.value = Math.min(100, data.reduce((sum, value) => sum + value, 0) / data.length)
    audioInputAnimationFrame = requestAnimationFrame(updateLevel)
  }

  updateLevel()
}

const testAudioInputDevice = async () => {
  if (isTestingAudioInput.value) {
    stopAudioInputTest()
    return
  }

  stopAudioInputTest()

  try {
    await startAudioInputTest()
  } catch {
    stopAudioInputTest()
  }
}

const stopVideoInputTest = () => {
  videoInputStream?.getTracks().forEach((track) => track.stop())
  videoInputStream = undefined

  if (videoPreviewElement.value) {
    videoPreviewElement.value.srcObject = null
  }

  isTestingVideoInput.value = false
}

const testVideoInputDevice = async () => {
  if (isTestingVideoInput.value) {
    stopVideoInputTest()
    return
  }

  stopVideoInputTest()

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: settings.value.selectedVideoInputDeviceId
          ? { exact: settings.value.selectedVideoInputDeviceId }
          : undefined
      }
    })

    videoInputStream = stream
    isTestingVideoInput.value = true
    await refreshMediaDevices()
    await nextTick()

    if (videoPreviewElement.value) {
      videoPreviewElement.value.srcObject = stream
    }
  } catch {
    stopVideoInputTest()
  }
}

const stopAudioOutputTest = () => {
  if (audioOutputTest) {
    audioOutputTest.pause()
    audioOutputTest.currentTime = 0
  }

  audioOutputTest = undefined
  isTestingAudioOutput.value = false
}

const testAudioOutputDevice = async () => {
  if (isTestingAudioOutput.value) {
    stopAudioOutputTest()
    return
  }

  stopAudioOutputTest()

  const sound = MAIN_PAGE_SOUND_ITEMS.find((item) => item.id === settings.value.sound) ?? MAIN_PAGE_SOUND_ITEMS[2]
  const audio = new Audio(getSoundSrc(sound.id, sound.src))

  audioOutputTest = audio
  isTestingAudioOutput.value = true
  await setAudioOutput(audio)
  audio.addEventListener('ended', stopAudioOutputTest, { once: true })
  audio.play().catch(stopAudioOutputTest)
}

const updateAudioInputDevice = async (selectedAudioInputDeviceId: unknown) => {
  if (typeof selectedAudioInputDeviceId !== 'string') return

  stopAudioInputTest()
  await shallowUpdate({ selectedAudioInputDeviceId })
}

const updateVideoInputDevice = async (selectedVideoInputDeviceId: unknown) => {
  if (typeof selectedVideoInputDeviceId !== 'string') return

  stopVideoInputTest()
  await shallowUpdate({ selectedVideoInputDeviceId })
}

const updateAudioOutputDevice = async (selectedAudioOutputDeviceId: unknown) => {
  if (typeof selectedAudioOutputDeviceId !== 'string') return

  stopAudioOutputTest()
  await shallowUpdate({ selectedAudioOutputDeviceId })
}

const handleMediaDeviceChange = () => {
  refreshMediaDevices()
}

watch(
  userAvatarRecord,
  (record, _previous, onCleanup) => {
    if (!record?.blob) {
      userAvatarUrl.value = ''
      return
    }

    const url = URL.createObjectURL(record.blob)

    userAvatarUrl.value = url
    onCleanup(() => {
      URL.revokeObjectURL(url)
    })
  },
  { immediate: true }
)

watch(
  () => user.value.username,
  (username) => {
    accountUsername.value = username
  },
  { immediate: true }
)

watch(() => route.params.settingsId, syncSelectedSettingsWithRoute)

onMounted(() => {
  syncSelectedSettingsWithRoute()
  refreshMediaDevices()

  if (navigator.mediaDevices?.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', handleMediaDeviceChange)
  }
})

onBeforeUnmount(() => {
  clearAccountAvatarPreview()
  stopPreviewSound()
  stopAudioInputTest()
  stopVideoInputTest()
  stopAudioOutputTest()

  if (navigator.mediaDevices?.removeEventListener) {
    navigator.mediaDevices.removeEventListener('devicechange', handleMediaDeviceChange)
  }
})
</script>

<template>
  <div class="settings-page">
    <aside class="settings-page__side-panel" :style="widgetWallpaperStyle">
      <div class="settings-page__panel-header">
        <AppHeader
          class="settings-page__panel-title"
          tag="h2"
          size="small"
          color="contrast-color"
          :text="$t(MAIN_PAGE_I18N.settings)"
        />
      </div>

      <div class="settings-page__settings">
        <button
          v-for="item in MAIN_PAGE_SETTINGS_ITEMS"
          :key="item.id"
          class="settings-page__panel-item"
          :class="{ 'settings-page__panel-item--active': selectedSettingsId === item.id }"
          type="button"
          @click="updateSelectedSettings(item.id)"
        >
          <span>{{ $t(item.label) }}</span>
          <AppText class="settings-page__panel-item-description" size="small" :text="$t(item.description)" />
        </button>
      </div>
    </aside>

    <section class="settings-page__content" :style="widgetWallpaperStyle">
      <header class="settings-page__content-header">
        <div>
          <AppHeader
            class="settings-page__content-title"
            tag="h1"
            size="medium"
            color="contrast-color"
            :text="$t(selectedSettingsItem.label)"
          />
          <!-- <AppText
            class="settings-page__content-subtitle"
            tag="p"
            :text="`${CLIENT_ENV.appName} ${CLIENT_ENV.appVersion}`"
          /> -->
        </div>
      </header>

      <div v-if="selectedSettingsId === 'account'" class="settings-page__settings-content">
        <section class="settings-page__account-section">
          <div class="settings-page__account-profile">
            <div class="settings-page__account-avatar">
              <img v-if="accountAvatarUrl" :src="accountAvatarUrl" :alt="user.username" />
              <!-- <AppIcon v-else name="user-stub" size="large" /> -->
            </div>
            <div>
              <AppText
                class="settings-page__account-name"
                bold
                color="contrast-color"
                :text="user.username"
              />
              <AppText class="settings-page__account-id" :text="`#${user.id}`" />
            </div>
          </div>

          <div class="settings-page__account-actions">
            <label class="settings-page__file-button settings-page__file-button--inline">
              <span>{{ $t(MAIN_PAGE_I18N.uploadPhoto) }}</span>
              <input
                :aria-label="$t(MAIN_PAGE_I18N.uploadPhoto)"
                accept="image/*"
                type="file"
                @change="uploadAccountAvatar"
              />
            </label>
            <Button
              :label="$t(MAIN_PAGE_I18N.resetPhoto)"
              size="small"
              text
              type="button"
              @click="resetAccountAvatar"
            />
          </div>

          <label class="settings-page__settings-field">
            <span>{{ $t(MAIN_PAGE_I18N.username) }}</span>
            <InputText v-model="accountUsername" autocomplete="username" fluid size="small" />
          </label>

          <Button
            class="settings-page__settings-submit"
            :label="$t(MAIN_PAGE_I18N.saveAccount)"
            :loading="isAccountSaving"
            size="small"
            type="button"
            @click="saveAccount"
          />
        </section>

        <section class="settings-page__account-section">
          <AppHeader
            class="settings-page__section-title"
            tag="h2"
            size="small"
            color="contrast-color"
            :text="$t(MAIN_PAGE_I18N.changePassword)"
          />

          <label class="settings-page__settings-field">
            <span>{{ $t(MAIN_PAGE_I18N.currentPassword) }}</span>
            <Password
              v-model="currentPassword"
              :feedback="false"
              autocomplete="current-password"
              fluid
              size="small"
              toggle-mask
            />
          </label>

          <label class="settings-page__settings-field">
            <span>{{ $t(MAIN_PAGE_I18N.newPassword) }}</span>
            <Password v-model="nextPassword" autocomplete="new-password" fluid size="small" toggle-mask />
          </label>

          <label class="settings-page__settings-field">
            <span>{{ $t(MAIN_PAGE_I18N.confirmPassword) }}</span>
            <Password
              v-model="repeatPassword"
              :feedback="false"
              autocomplete="new-password"
              fluid
              size="small"
              toggle-mask
            />
          </label>

          <Message v-if="passwordMismatch" severity="error" size="small" variant="simple">
            {{ $t(MAIN_PAGE_I18N.passwordMismatch) }}
          </Message>

          <Button
            class="settings-page__settings-submit"
            :disabled="isPasswordSubmitDisabled"
            :label="$t(MAIN_PAGE_I18N.changePassword)"
            :loading="isPasswordChanging"
            size="small"
            type="button"
            @click="changePassword"
          />
        </section>
      </div>

      <div v-if="selectedSettingsId === 'theme'" class="settings-page__settings-content">
        <ThemeSettings
          :custom-theme="settings.customTheme"
          :theme="settings.theme"
          @change-custom-theme-color="changeCustomThemeColor"
          @change-theme="changeTheme"
        />
      </div>

      <div v-if="selectedSettingsId === 'language'" class="settings-page__settings-content">
        <label class="settings-page__settings-field">
          <span>{{ $t(MAIN_PAGE_I18N.language) }}</span>
          <Select
            :model-value="settings.language"
            fluid
            :options="MAIN_PAGE_LANGUAGE_OPTIONS"
            option-label="label"
            option-value="value"
            size="small"
            @update:model-value="changeLanguage"
          />
        </label>
      </div>

      <div v-if="selectedSettingsId === 'wallpaper'" class="settings-page__settings-content">
        <label class="settings-page__switch">
          <span>{{ $t(MAIN_PAGE_I18N.wallpaperEnabled) }}</span>
          <ToggleSwitch :model-value="settings.showWallpaper" @update:model-value="updateWallpaperVisibility" />
        </label>

        <div class="settings-page__wallpaper-options">
          <button
            v-for="item in MAIN_PAGE_WALLPAPER_ITEMS"
            :key="item.id"
            class="settings-page__wallpaper-option"
            :class="{ 'settings-page__wallpaper-option--active': settings.wallpaper === item.id }"
            type="button"
            @click="updateWallpaper(item.id)"
          >
            <span class="settings-page__wallpaper-title">{{ $t(item.label) }}</span>
            <span class="settings-page__wallpaper-preview">
              <span class="settings-page__wallpaper-preview-card" :style="{ backgroundImage: `url(${item.lightSrc})` }">
                {{ $t(MAIN_PAGE_I18N.defaultLightWallpaper) }}
              </span>
              <span class="settings-page__wallpaper-preview-card" :style="{ backgroundImage: `url(${item.darkSrc})` }">
                {{ $t(MAIN_PAGE_I18N.defaultDarkWallpaper) }}
              </span>
            </span>
          </button>

          <button
            class="settings-page__wallpaper-option"
            :class="{ 'settings-page__wallpaper-option--active': settings.wallpaper === 'custom' }"
            :style="{
              backgroundImage: settings.customWallpaperDataUrl ? `url(${settings.customWallpaperDataUrl})` : undefined
            }"
            type="button"
            @click="updateWallpaper('custom')"
          >
            <span class="settings-page__wallpaper-title">{{ $t(MAIN_PAGE_I18N.customWallpaper) }}</span>
          </button>
        </div>

        <label class="settings-page__file-button">
          <span>{{ $t(MAIN_PAGE_I18N.uploadWallpaper) }}</span>
          <input
            :aria-label="$t(MAIN_PAGE_I18N.uploadWallpaper)"
            accept="image/*"
            type="file"
            @change="uploadWallpaper"
          />
        </label>
      </div>

      <div v-if="selectedSettingsId === 'notifications'" class="settings-page__settings-content">
        <label class="settings-page__switch">
          <span>{{ $t(MAIN_PAGE_I18N.notificationsEnabled) }}</span>
          <ToggleSwitch :model-value="settings.showNotification" @update:model-value="updateNotificationVisibility" />
        </label>
        <AppText class="settings-page__settings-hint" tag="p" :text="$t(MAIN_PAGE_I18N.notificationsHint)" />
      </div>

      <div v-if="selectedSettingsId === 'sound'" class="settings-page__settings-content">
        <label class="settings-page__switch">
          <span>{{ $t(MAIN_PAGE_I18N.soundEnabled) }}</span>
          <ToggleSwitch :model-value="settings.soundOn" @update:model-value="updateSound" />
        </label>

        <div class="settings-page__sound-options">
          <div
            v-for="item in MAIN_PAGE_SOUND_ITEMS"
            :key="item.id"
            class="settings-page__sound-option"
            :class="{ 'settings-page__sound-option--active': settings.sound === item.id }"
          >
            <button class="settings-page__sound-select" type="button" @click="updateSoundValue(item.id)">
              <span>{{ $t(item.label) }}</span>
            </button>
            <div class="settings-page__sound-actions">
              <Button
                :aria-label="$t(playingSoundId === item.id ? MAIN_PAGE_I18N.stopSound : MAIN_PAGE_I18N.playSound)"
                size="small"
                text
                type="button"
                :icon="playingSoundId === item.id ? 'pi pi-stop' : 'pi pi-play'"
                @click="previewSound(item.id, item.src)"
              />
              <label class="settings-page__sound-upload">
                <span>{{ $t(MAIN_PAGE_I18N.uploadSound) }}</span>
                <input
                  :aria-label="$t(MAIN_PAGE_I18N.uploadSound)"
                  accept="audio/*"
                  type="file"
                  @change="uploadSound(item.id, $event)"
                />
              </label>
              <Button
                :disabled="!hasCustomSound(item.id)"
                :label="$t(MAIN_PAGE_I18N.defaultSound)"
                size="small"
                text
                type="button"
                @click="restoreDefaultSound(item.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedSettingsId === 'devices'" class="settings-page__settings-content">
        <label class="settings-page__settings-field">
          <span>{{ $t(MAIN_PAGE_I18N.audioInputDevice) }}</span>
          <div class="settings-page__device-control">
            <Select
              :empty-message="$t(MAIN_PAGE_I18N.noDevices)"
              fluid
              :model-value="settings.selectedAudioInputDeviceId"
              :options="audioInputDeviceOptions"
              option-label="label"
              option-value="value"
              size="small"
              @update:model-value="updateAudioInputDevice"
              @show="refreshMediaDevices"
            />
            <Button
              :aria-label="$t(isTestingAudioInput ? MAIN_PAGE_I18N.stopDeviceTest : MAIN_PAGE_I18N.testDevice)"
              size="small"
              text
              type="button"
              @click="testAudioInputDevice"
            >
              <!-- <AppIcon :name="isTestingAudioInput ? 'cross' : 'thunder'" size="xs" /> -->
            </Button>
          </div>
          <div v-if="isTestingAudioInput" class="settings-page__audio-level">
            <span :style="{ width: `${audioInputLevel}%` }" />
          </div>
        </label>

        <label class="settings-page__settings-field">
          <span>{{ $t(MAIN_PAGE_I18N.videoInputDevice) }}</span>
          <div class="settings-page__device-control">
            <Select
              :empty-message="$t(MAIN_PAGE_I18N.noDevices)"
              fluid
              :model-value="settings.selectedVideoInputDeviceId"
              :options="videoInputDeviceOptions"
              option-label="label"
              option-value="value"
              size="small"
              @update:model-value="updateVideoInputDevice"
              @show="refreshMediaDevices"
            />
            <Button
              :aria-label="$t(isTestingVideoInput ? MAIN_PAGE_I18N.stopDeviceTest : MAIN_PAGE_I18N.testDevice)"
              size="small"
              text
              type="button"
              @click="testVideoInputDevice"
            >
              <!-- <AppIcon :name="isTestingVideoInput ? 'cross' : 'video-call'" size="xs" /> -->
            </Button>
          </div>
          <video
            v-if="isTestingVideoInput"
            ref="videoPreviewElement"
            class="settings-page__video-preview"
            autoplay
            muted
            playsinline
          />
        </label>

        <label class="settings-page__settings-field">
          <span>{{ $t(MAIN_PAGE_I18N.audioOutputDevice) }}</span>
          <div class="settings-page__device-control">
            <Select
              :empty-message="$t(MAIN_PAGE_I18N.noDevices)"
              fluid
              :model-value="settings.selectedAudioOutputDeviceId"
              :options="audioOutputDeviceOptions"
              option-label="label"
              option-value="value"
              size="small"
              @update:model-value="updateAudioOutputDevice"
              @show="refreshMediaDevices"
            />
            <Button
              :aria-label="$t(isTestingAudioOutput ? MAIN_PAGE_I18N.stopDeviceTest : MAIN_PAGE_I18N.testDevice)"
              size="small"
              text
              type="button"
              @click="testAudioOutputDevice"
            >
              <!-- <AppIcon :name="isTestingAudioOutput ? 'cross' : 'thunder'" size="xs" /> -->
            </Button>
          </div>
        </label>
      </div>

      <div v-if="selectedSettingsId === 'storage'" class="settings-page__settings-content" />

      <div v-if="selectedSettingsId === 'faq'" class="settings-page__settings-content">
        <article class="settings-page__document">
          <AppText tag="p" color="semi-contrast-color" :text="$t(MAIN_PAGE_I18N.faqPlaceholder)" />
        </article>
      </div>

      <div v-if="selectedSettingsId === 'question'" class="settings-page__settings-content">
        <article class="settings-page__document">
          <AppText tag="p" color="semi-contrast-color" :text="$t(MAIN_PAGE_I18N.questionPlaceholder)" />
          <div class="settings-page__content-actions">
            <Button
              :label="$t(MAIN_PAGE_I18N.openFaq)"
              size="small"
              text
              type="button"
              @click="updateSelectedSettings('faq')"
            />
            <RouterLink :to="MAIN_PAGE_ROUTES.chatRooms" custom v-slot="{ href, navigate }">
              <Button :href="href" :label="$t(MAIN_PAGE_I18N.supportChat)" as="a" size="small" @click="navigate" />
            </RouterLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style>
.settings-page {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.settings-page__side-panel,
.settings-page__content {
  isolation: isolate;
  position: relative;

  overflow: hidden;

  min-height: 0;
  border: 1px solid var(--p-app-widget-border-color, var(--p-content-border-color));
  border-radius: 18px;

  background-color: var(--p-app-widget-background, var(--p-content-background));
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 320px auto;
  box-shadow: 12px 12px 28px var(--p-app-shadow-outset-start), -12px -12px 28px var(--p-app-shadow-outset-end);
}

.settings-page__side-panel::before,
.settings-page__content::before {
  pointer-events: none;
  content: '';

  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-50deg);

  display: var(--main-layout-wallpaper-pseudo-display, none);

  width: 240vmax;
  height: 240vmax;

  opacity: 0.3;
  background-image: var(--main-page-widget-wallpaper);
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 280px auto;
}

.settings-page__side-panel > *,
.settings-page__content > * {
  position: relative;
  z-index: 1;
}

.settings-page__side-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
}

.settings-page__content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 16px;
}

.settings-page__panel-header,
.settings-page__content-header,
.settings-page__content-actions,
.settings-page__account-profile,
.settings-page__account-actions {
  display: flex;
  align-items: center;
}

.settings-page__panel-header {
  justify-content: space-between;
}

.settings-page__settings,
.settings-page__settings-content,
.settings-page__settings-field,
.settings-page__switch,
.settings-page__sound-options,
.settings-page__document {
  display: grid;
  gap: 12px;
  align-content: start;
}

.settings-page__settings-content,
.settings-page__settings {
  overflow: auto;
  min-height: 0;
}

.settings-page__panel-item,
.settings-page__account-section,
.settings-page__document {
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  background: var(--p-app-muted-background);
}

.settings-page__panel-item {
  cursor: pointer;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 4px;
  align-items: center;

  width: 100%;
  padding: 12px;

  color: var(--p-app-text-contrast);
  text-align: left;
}

.settings-page__panel-item span,
.settings-page__panel-item-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-page__panel-item-description {
  grid-column: 1 / -1;
}

.settings-page__panel-item:hover,
.settings-page__panel-item--active {
  border-color: var(--p-primary-color);
}

.settings-page__content-header {
  gap: 12px;
}

.settings-page__content-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;

  width: 42px;
  height: 42px;
  border-radius: 50%;

  color: var(--p-primary-contrast-color);

  background: var(--p-primary-color);
}

.settings-page__content-title {
  overflow-wrap: anywhere;
}

.settings-page__account-section {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 14px;
}

.settings-page__account-profile,
.settings-page__account-actions,
.settings-page__content-actions {
  gap: 12px;
}

.settings-page__account-profile {
  min-width: 0;
}

.settings-page__account-name,
.settings-page__account-id {
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-page__account-avatar {
  overflow: hidden;
  display: grid;
  flex: 0 0 auto;
  place-items: center;

  width: 72px;
  height: 72px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  color: var(--p-primary-color);

  background: var(--p-app-widget-background, var(--p-content-background));
}

.settings-page__account-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.settings-page__account-actions {
  flex-wrap: wrap;
}

.settings-page__settings-submit {
  justify-self: start;
}

.settings-page__switch,
.settings-page__device-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.settings-page__device-control {
  gap: 8px;
}

.settings-page__device-control :deep(.p-button) {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.settings-page__audio-level {
  overflow: hidden;
  height: 8px;
  border-radius: 8px;
  background: var(--p-app-muted-background);
}

.settings-page__audio-level span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--p-primary-color);
}

.settings-page__video-preview {
  aspect-ratio: 16 / 9;
  width: min(420px, 100%);
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  object-fit: cover;
  background: var(--p-app-muted-background);
}

.settings-page__wallpaper-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
}

.settings-page__wallpaper-option,
.settings-page__sound-option,
.settings-page__file-button {
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  background: var(--p-app-muted-background);
}

.settings-page__wallpaper-option {
  cursor: pointer;

  display: grid;
  gap: 10px;
  align-items: stretch;

  min-height: 144px;
  padding: 12px;

  color: var(--p-app-text-contrast);
  text-align: left;

  background-repeat: repeat;
  background-position: 0 0;
  background-size: 120px auto;
}

.settings-page__wallpaper-option:hover,
.settings-page__wallpaper-option--active,
.settings-page__sound-option:hover,
.settings-page__sound-option--active,
.settings-page__file-button:hover {
  border-color: var(--p-primary-color);
}

.settings-page__wallpaper-title {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--p-app-widget-background, var(--p-content-background));
}

.settings-page__wallpaper-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.settings-page__wallpaper-preview-card {
  display: grid;
  align-items: end;

  min-height: 86px;
  padding: 8px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  font-size: 0.82rem;

  background-color: var(--p-app-muted-background);
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 100px auto;
}

.settings-page__file-button {
  cursor: pointer;

  position: relative;

  display: grid;
  place-items: center;

  min-height: 42px;

  color: var(--p-app-text-contrast);
}

.settings-page__file-button--inline {
  min-height: 36px;
  padding: 0 12px;
}

.settings-page__file-button input,
.settings-page__sound-upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.settings-page__sound-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;

  min-height: 52px;
  padding: 8px 12px;

  color: var(--p-app-text-contrast);
}

.settings-page__sound-select {
  cursor: pointer;

  min-width: 0;
  padding: 0;
  border: 0;

  color: var(--p-app-text-contrast);
  text-align: left;

  background: transparent;
}

.settings-page__sound-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.settings-page__sound-actions :deep(.p-button) {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
}

.settings-page__sound-upload {
  cursor: pointer;

  position: relative;

  display: grid;
  place-items: center;

  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;

  color: var(--p-primary-color);
}

.settings-page__sound-upload:hover {
  background: var(--p-app-muted-background);
}

.settings-page__document {
  overflow: auto;
  padding: 14px;
}

@include screen-until('tablet') {
  .settings-page {
    grid-template-columns: 1fr;
  }

  .settings-page__side-panel {
    min-height: 220px;
  }
}
</style>
