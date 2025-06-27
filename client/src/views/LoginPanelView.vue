<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-overlay
      :model-value="AuthStore.isAuthLoading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>

    <v-card class="pa-6" min-width="400">
      <v-card-title class="text-h5">Zaloguj się</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onSubmit" ref="form">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Hasło"
            type="password"
            required
            :error="!!AuthStore.getAuthError"
            :error-messages="AuthStore.getAuthError"
          ></v-text-field>

          <v-btn type="submit" color="primary" block>Zaloguj</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useAuthStore} from "@/stores";
import {useRouter} from "vue-router";

const email = ref('')
const password = ref('')
const form = ref(null)
const AuthStore = useAuthStore()
const router = useRouter()

const onSubmit = async () => {
  await AuthStore.login(email.value, password.value)
  await router.push('reservations')
}
</script>

<style scoped>
.fill-height {
  position: absolute!important;
  top: 0!important;
  left: 0!important;
  min-height: 100vh;
  min-width: 100vw;
}
</style>
