<script setup lang="ts">
import SettingsAudioInputDeviceCard from './SettingsAudioInputDeviceCard.vue'
import SettingsAudioOutputDeviceCard from './SettingsAudioOutputDeviceCard.vue'
import SettingsVideoInputDeviceCard from './SettingsVideoInputDeviceCard.vue'
</script>

<template>
  <div class="settings-devices-content settings-content-grid settings-content-grid--compact-cards">
    <SettingsAudioInputDeviceCard />
    <SettingsVideoInputDeviceCard />
    <SettingsAudioOutputDeviceCard />
  </div>
</template>
