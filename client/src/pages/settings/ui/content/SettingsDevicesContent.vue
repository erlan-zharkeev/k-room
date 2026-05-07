<script setup lang="ts">
import SettingsAudioInputDeviceCard from './devices/SettingsAudioInputDeviceCard.vue'
import SettingsAudioOutputDeviceCard from './devices/SettingsAudioOutputDeviceCard.vue'
import SettingsVideoInputDeviceCard from './devices/SettingsVideoInputDeviceCard.vue'
</script>

<template>
  <div class="settings-devices-content settings-content-grid">
    <SettingsAudioInputDeviceCard />
    <SettingsVideoInputDeviceCard />
    <SettingsAudioOutputDeviceCard />
  </div>
</template>

<style lang="scss">
.settings-devices-content.settings-content-grid {
  grid-template-columns: 1fr;
}
</style>
