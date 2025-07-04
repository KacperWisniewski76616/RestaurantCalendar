<script setup lang="ts">
import {useAuthStore, useReservationStore} from "@/stores";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import type {IReservationDto} from "@/types";
import moment from "moment";
import UpdateReservationForm from "@/components/UpdateReservationForm.vue";

const minDate = moment().format('YYYY-MM-DD')
const getNextAvailableTimeSlot = (): { date: string, time: string } => {
  const now = moment()
  const startHour = 16
  const endHour = 22
  const today = moment().startOf('day')
  const endOfToday = moment(today).hour(endHour)

  if (now.isSameOrAfter(endOfToday)) {
    return {
      date: now.add(1, 'day').format('YYYY-MM-DD'),
      time: '16:00'
    }
  }

  const minutes = now.minutes()
  const roundedMinutes = minutes < 30 ? 30 : 0
  const roundedHour = minutes < 30 ? now.hour() : now.hour() + 1

  let candidate = moment().set({minute: roundedMinutes, hour: roundedHour, second: 0})

  if (candidate.hour() < startHour) {
    candidate = moment().set({hour: startHour, minute: 0, second: 0})
  }

  return {
    date: candidate.format('YYYY-MM-DD'),
    time: candidate.format('HH:mm')
  }
}

const ReservationStore = useReservationStore()
const AuthStore = useAuthStore()
const formInit = {
  user: AuthStore.getUserData?._id ?? '',
  ...getNextAvailableTimeSlot(),
  desc: '',
  guests: 2,
  table_id: ''
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

const form = ref<IReservationDto>(formInit)

const dateDialog = ref<boolean>(false)
const successModal = ref<boolean>(false)

const loading = computed(() => ReservationStore.getLoading)
const error = computed(() => ReservationStore.getError)
const reservationList = computed(() => ReservationStore.getReservations.filter(r => r.user === AuthStore.getUserData?._id))
const tableList = computed(() => ReservationStore.getTables)
const existErrorDelete = ref<boolean>(false)
const deleteSuccess = ref<boolean>(false)
const updateDialog = ref<boolean>(false)
const selectedRes = ref<string>()
const updateSuccess = ref<boolean>(false)

const timeOptions = computed(() => {
  const options = []
  let hour = 16
  let minute = 0
  const now = moment()
  const selectedDate = moment(form.value.date)

  while (hour < 22 || (hour === 22 && minute === 0)) {
    const optionTime = moment({hour, minute})
    const label = optionTime.format('HH:mm')

    if (
      selectedDate.isAfter(now, 'day') ||
      (selectedDate.isSame(now, 'day') && optionTime.isSameOrAfter(now, 'minute'))
    ) {
      options.push({label, value: label})
    }

    minute += 30
    if (minute === 60) {
      minute = 0
      hour++
    }
  }

  return options
})

const guestsOptions = computed(() => {
  const options = []
  let guest = 1
  while (guest < 6) {
    options.push(guest)
    guest++
  }
  return options
})

const tableOptions = computed(() => {
  return ReservationStore.getTables.filter(t =>
    t.capacity >= form.value.guests
    && t.min <= form.value.guests
    && !ReservationStore.getReservations
      .some(r =>
        r.table_id === t._id
        && r.date === form.value.date
        && r.time === form.value.time))
})

const submit = async () => {
  const selectedDateTime = moment(`${form.value.date} ${form.value.time}`, 'YYYY-MM-DD HH:mm')
  const now = moment()

  if (selectedDateTime.isBefore(now)) {
    alert('Nie można zarezerwować terminu w przeszłości.')
    return
  }

  await ReservationStore.createReservation(form.value)

  if (!error.value) {
    await nextTick(async () => await loadData())
    form.value.date = formInit.date
    form.value.time = formInit.time
    form.value.guests = formInit.guests
    form.value.table_id = formInit.table_id
    successModal.value = true
  }
}

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

    <v-card>
      <v-form @submit.prevent="submit">
        <v-card-text>
          <v-row class="flex align-center">
            <v-col cols="12" md="4">
              <v-dialog v-model="dateDialog" width="auto">
                <template #activator="{ props }">
                  <v-text-field v-bind="props"
                                label="Data"
                                required
                                placeholder="Wybierz datę"
                                persistent-placeholder
                                v-model="form.date"
                                readonly/>
                </template>
                <v-card>
                  <v-date-picker
                    :first-day-of-week="6"
                    locale="pl"
                    v-model="form.date"
                    :min="minDate"
                    @update:model-value="(val) => {
                      form.date = moment(val).format('YYYY-MM-DD');
                      dateDialog=false
                      form.table_id = ''
                    }"
                  />
                </v-card>
              </v-dialog>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="form.time"
                :items="timeOptions"
                label="Wybierz godzinę"
                required
                item-title="label"
                item-value="value"
                @update:model-value="() => form.table_id = ''"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="form.guests"
                :items="guestsOptions"
                @update:model-value="() => form.table_id = ''"
                label="Liczba gości"
                required
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="form.table_id"
                :items="tableOptions"
                label="Stolik"
                item-value="_id"
                item-title="name"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-textarea v-model="form.desc"
                          label="Dodatkowe informacje"
                          placeholder="Uzupełnij"
                          persistent-placeholder
                          clearable/>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>

          <v-tooltip text="Dostępność">
            <v-badge inline color="success"/>
          </v-tooltip>

          <v-btn color="success" type="submit" variant="outlined">Rezerwuj</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-card title="Twoje rezerwacje"
            class="mt-6"
    >
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="reservationList"
          :items-per-page="10"
        >
          <template #item.user="{item}">
            {{
              AuthStore.getUserData && AuthStore.getUserData._id === item.user ? AuthStore.getUserData.name + ' ' + AuthStore.getUserData.lastName : 'Nieznany użytkownik'
            }}
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
              <v-btn color="primary" size="small" variant="text" icon="mdi-file-edit" @click="() => {
                updateDialog = true
                selectedRes = item._id
              }"/>

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

    <v-dialog v-model="updateDialog" max-width="600">
      <UpdateReservationForm v-if="selectedRes" :id="selectedRes" :close-modal="(success?: boolean) => {
        updateDialog = false
        selectedRes = undefined
        if(!!success) {
          updateSuccess = true
          loadData()
        }
      }"/>
    </v-dialog>

    <v-snackbar
      :timeout="2000"
      color="success"
      v-model="successModal"
    >
      Pomyślnie utworzono rezerwację
    </v-snackbar>

    <v-snackbar
      :timeout="2000"
      color="success"
      v-model="updateSuccess"
    >
      Pomyślnie zmieniono rezerwację
    </v-snackbar>

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
