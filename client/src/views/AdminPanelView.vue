<script setup lang="ts">
import {useAuthStore, useReservationStore} from "@/stores";
import {computed, onMounted} from "vue";

const headers = [
  {title: 'Imię i nazwisko', key: 'user'},
  {title: 'Data', key: 'date'},
  {title: 'Godzina', key: 'time'},
  {title: 'Opis', key: 'desc'},
  {title: 'Liczba gości', key: 'guests'},
  {title: 'Stolik', key: 'table_id'},
  {title: 'Akcje', key: 'actions'}
]

const ReservationStore = useReservationStore()
const AuthStore = useAuthStore()

const getName = (user_id: string) => {
  const user =  AuthStore.getUserList.find(u => u._id === user_id)

  return user ? user.name + ' ' + user.lastName : 'Nieznany użytkownik'
}

const loading = computed(() => ReservationStore.getLoading)
const error = computed(() => ReservationStore.getError)
const tableList = computed(() => ReservationStore.getTables)

const loadData = async () => {
  await ReservationStore.fetchReservations()
  await ReservationStore.fetchTables()
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
<v-container fluid>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
  >
    <v-progress-circular
      color="primary"
      size="64"
      indeterminate
    ></v-progress-circular>
  </v-overlay>

  <v-card v-if="error" color="error" :title="error"></v-card>

  <v-card title="Rezerwacje"
          class="mt-6"
  >
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="ReservationStore.getReservations"
        :items-per-page="10"
      >
        <template #item.user="{item}">
          {{getName(item.user)}}
        </template>

        <template #item.date="{ item }">
          {{ item.date }}
        </template>

        <template #item.time="{ item }">
          {{ item.time }}
        </template>

        <template #item.desc="{ item }">
          {{ item.desc || '-' }}
        </template>

        <template #item.table_id="{ item }">
          {{ tableList.find(t => t._id === item.table_id)?.name || 'Nie znaleziono stolika' }}
        </template>

        <template #item.actions="{ item }">
          <div class="flex flex-row justify-between align-center">
            <v-btn color="error" size="small" variant="text" icon="mdi-delete"/>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</v-container>
</template>

<style scoped>

</style>
