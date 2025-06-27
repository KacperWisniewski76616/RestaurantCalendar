<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import type {IReservationDto} from "@/types";
import {useReservationStore} from "@/stores";
import moment from "moment/moment";

const ReservationStore = useReservationStore()
const minDate = moment().format('YYYY-MM-DD')

const dateDialog = ref<boolean>(false)
const form = ref<IReservationDto>()

const props = defineProps({
  id: {type: String, required: true},
  closeModal: {type: Function, required: true}
})

const componentError = ref<string>()

const error = computed(() => ReservationStore.getUpdateError)
const loading = computed(() => ReservationStore.isUpdateLoading)

const timeOptions = computed(() => {
  const options = []
  let hour = 16
  let minute = 0
  const now = moment()
  const selectedDate = form.value ? moment(form.value.date) : moment()

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
    !form.value || (
      t.capacity >= form.value.guests
      && t.min <= form.value.guests
      && !ReservationStore.getReservations
        .some(r =>
          t._id !== ReservationStore.getReservations.find(r => r._id === props.id)?.table_id && (
            r.table_id === t._id
            && r.date === (form.value as IReservationDto).date
            && r.time === (form.value as IReservationDto).time
          ))))
})

onMounted(() => {
  const details = ReservationStore.getReservations.find(r => r._id === props.id)

  if (!details)
    componentError.value = 'Nie znaleziono rezerwacji do edycji'
  else
    form.value = details
})

const submit = async () => {
  if (!form.value)
    return

  const selectedDateTime = moment(`${form.value.date} ${form.value.time}`, 'YYYY-MM-DD HH:mm')
  const now = moment()

  if (selectedDateTime.isBefore(now)) {
    alert('Nie można zarezerwować terminu w przeszłości.')
    return
  }

  await ReservationStore.updateReservation(props.id, form.value)

  if (!error.value) {
    props.closeModal(true)
  }
}
</script>

<template>
  <v-card v-if="form" title="Zmień rezerwacje">
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
                    if(form){
                      form.date = moment(val).format('YYYY-MM-DD');
                      dateDialog=false
                      form.table_id = ''
                    }}"
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
              @update:model-value="() => {if(form){form.table_id = ''}}"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="form.guests"
              :items="guestsOptions"
              @update:model-value="() => {if(form){form.table_id = ''}}"
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

        <span v-if="error" class="text-red-accent-1">{{error}}</span>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>

        <v-btn color="error" type="button" variant="outlined" @click="props.closeModal(false)">Anuluj</v-btn>

        <v-btn color="success" type="submit" variant="outlined">Zmień</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>

  <v-card v-else-if="componentError" color="error" :title="componentError">
    <v-card-actions>
      <v-spacer/>

      <v-btn color="error" type="button" variant="outlined" @click="props.closeModal(false)">Anuluj</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>
