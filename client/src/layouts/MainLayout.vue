<script setup lang="ts">
import {useAuthStore} from "@/stores";

const AuthStore = useAuthStore()
const handleLogout = async () => {
  await AuthStore.logout()
}
</script>

<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Restaurant Calendar</v-app-bar-title>
      <v-btn to="/reservations" variant="text" class="mx-2" exact>
        Rezerwacje
      </v-btn>
      <v-btn v-if="AuthStore.getUserData && AuthStore.getUserData.isAdmin" to="/admin-panel" variant="text" class="mx-2" exact>
        Admin Panel
      </v-btn>
      <v-spacer/>
      <v-btn @click="handleLogout" color="secondary" variant="elevated">
        Wyloguj
      </v-btn>
    </v-app-bar>

    <div class="layout-content">
      <v-card color="error" v-if="AuthStore.getUserListError" :title="AuthStore.getUserListError"/>
      <RouterView/>
    </div>
  </v-app>
</template>

<style>
.layout-content {
  min-height: 100vh;
  min-width: 100vw;
  padding: 64px 24px;
  background: #fff;
  margin: 0;
  height: 100%;
  overflow-y: auto;
}
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  min-width: 100vw;
  background: #222;
  overflow: hidden;
}

</style>
