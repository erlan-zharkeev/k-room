<script setup lang="ts">
import { Button } from 'primevue'

import { useUser } from 'src/entities/user'
import { MAIN_PAGE_I18N, useLogout } from 'src/pages/main'
import { useI18n } from 'src/shared/lib'
import { AppProfileBasicData } from 'src/shared/ui'

const { t } = useI18n()
const { user, avatarId} = useUser()
const { isLogoutLoading, logout } = useLogout()

</script>

<template>
  <header class="main-top-bar">
    <AppProfileBasicData :image-alt="user.username" :image-id="avatarId" :title="user.username">
      <template #description>
        <!--  -->
      </template>
    </AppProfileBasicData>
    <div class="main-top-bar__actions">
      <Button :aria-label="t(MAIN_PAGE_I18N.logout)" :loading="isLogoutLoading" rounded size="large" text icon="pi pi-sign-out" @click="logout" />
    </div>
  </header>
</template>

<style>
.main-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
