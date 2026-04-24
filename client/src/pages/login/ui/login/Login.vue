<script setup lang="ts">
import { AuthTabsLayout } from 'src/widgets/auth-tabs-layout'

import { useFirebase } from '../../model/use-firebase'
import { useLogin } from '../../model/use-login'

import LoginForm from './LoginForm/LoginForm.vue'

const { isLoading, onLogin } = useLogin()
const { isFirebaseLoginLoading, onFirebaseLogin } = useFirebase()
</script>

<template>
  <AuthTabsLayout :block-navigation="isLoading || isFirebaseLoginLoading">
    <LoginForm
      :is-firebase-login-loading="isFirebaseLoginLoading"
      :is-loading="isLoading"
      :on-firebase-login="onFirebaseLogin"
      :on-login="onLogin"
    />
  </AuthTabsLayout>
</template>
