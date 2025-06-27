<script setup lang="ts">
import {useAuthStore, useReservationStore} from "@/stores";
import {computed, nextTick, onMounted, ref} from "vue";
import type {ITableDto} from "@/types";
import moment from "moment/moment";

const initTable = {
  name: '',
  capacity: 2,
  min: 1,
}

const headers = [
  {title: 'Imię i nazwisko', key: 'user'},
  {title: 'Data', key: 'date'},
  {title: 'Godzina', key: 'time'},
  {title: 'Opis', key: 'desc'},
  {title: 'Liczba gości', key: 'guests'},
  {title: 'Stolik', key: 'table_id'},
  {title: 'Akcje', key: 'actions'}
]

const headersTables = [
  {title: 'Nazwa', key: 'name'},
  {title: 'Min', key: 'min'},
  {title: 'Max', key: 'capacity'},
]

const ReservationStore = useReservationStore()
const AuthStore = useAuthStore()

const getName = (user_id: string) => {
  const user = AuthStore.getUserList.find(u => u._id === user_id)

  return user ? user.name + ' ' + user.lastName : 'Nieznany użytkownik'
}

const loading = computed(() => ReservationStore.getLoading)
const error = computed(() => ReservationStore.getError)
const tableList = computed(() => ReservationStore.getTables)
const existErrorDelete = ref<boolean>(false)
const deleteSuccess = ref<boolean>(false)
const createTableSuccess = ref<boolean>(false)
const formError = ref<string>()

const guestsOptions = computed(() => {
  const options = []
  let guest = 1
  while (guest < 6) {
    options.push(guest)
    guest++
  }
  return options
})

const form = ref<ITableDto>(initTable)

const deleteRes = async (id: string) => {
  await ReservationStore.deleteReservation(id)

  if (!existErrorDelete.value)
    await nextTick(async () => {
      await loadData()
      deleteSuccess.value = true
    })
  else
    existErrorDelete.value = true
}

const submit = async () => {
  formError.value = undefined

  if(!form.value.name || form.value.name === '') {
    formError.value = 'Uzupełnij nazwę'
    return
  }

  await ReservationStore.createTable(form.value)

  if (!error.value) {
    await nextTick(async () => await loadData())
    form.value.name = initTable.name
    form.value.min = initTable.min
    form.value.capacity = initTable.capacity
    createTableSuccess.value = true
  }
}

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

    <v-card title="Dodaj stolik">
      <v-form @submit.prevent="submit">
        <v-card-text>
          <v-row class="flex align-center">
            <v-col cols="12" md="4">
              <v-text-field v-model="form.name" label="Nazwa" placeholder="Wpisz nazwę"
                          persistent-placeholder :error="!!formError" :error-messages="formError"/>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="form.min"
                :items="guestsOptions"
                @update:model-value="(val) => {if(form.capacity < val) form.capacity = val}"
                label="Min l.gości"
                required
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="form.capacity"
                :items="guestsOptions.filter(el => el>=form.min)"
                label="Max l.gości"
                required
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>

          <v-btn color="success" type="submit" variant="outlined">Dodaj</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-card v-if="error" color="error" :title="error"></v-card>

    <v-card title="Stoliki"
            class="mt-6"
    >
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="ReservationStore.getReservations"
          :items-per-page="10"
        >
          <template #item.user="{item}">
            {{ getName(item.user) }}
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
            <div v-if="item._id" class="flex flex-row justify-between align-center">
              <v-btn color="error"
                     size="small"
                     variant="text"
                     icon="mdi-delete"
                     :disabled="ReservationStore.isDeleteLoading"
                     :loading="ReservationStore.isDeleteLoading"
                     @click="deleteRes(item._id)"/>

            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card title="Rezerwacje"
            class="mt-6"
    >
      <v-card-text>
        <v-data-table
          :headers="headersTables"
          :items="ReservationStore.getTables"
          :items-per-page="10"
        />
      </v-card-text>
    </v-card>

    <v-snackbar
      :timeout="2000"
      color="success"
      v-model="deleteSuccess"
    >
      Pomyślnie usunięto rezerwację
    </v-snackbar>

    <v-snackbar
      :timeout="2000"
      color="error"
      v-model="existErrorDelete"
    >
      {{ ReservationStore.getDeleteError }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>

</style>
