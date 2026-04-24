<script setup lang="ts">
import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { useRegistration } from '../../model/use-registration'

import RegistrationForm from './RegistrationForm/RegistrationForm.vue'

const { isLoading, onRegister } = useRegistration()
</script>

<template>
  <AuthTabsLayout :block-navigation="isLoading">
    <RegistrationForm :is-loading="isLoading" :on-register="onRegister" />
  </AuthTabsLayout>
</template>
