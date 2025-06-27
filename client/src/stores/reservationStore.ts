import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {ComputedRef} from 'vue'
import type {IReservationDto, ITableDto} from "@/types";
import {restaurantApi} from "@/apis";
import {CommonUtils} from "@/utils";

export const useReservationStore = defineStore('resertations', () => {
  const resList = ref<IReservationDto[]>([])
  const tableList = ref<ITableDto[]>([])

  const resListLoading = ref<boolean>(false)
  const tableListLoading = ref<boolean>(false)
  const resCreateLoading = ref<boolean>(false)
  const resDeleteLoading = ref<boolean>(false)
  const resUpdateLoading = ref<boolean>(false)
  const createTableLoading = ref<boolean>(false)

  const resListError = ref<string>()
  const tableListError = ref<string>()
  const resCreateError = ref<string>()
  const resDeleteError = ref<string>()
  const resUpdateError = ref<string>()
  const createTableError = ref<string>()

  const getReservations: ComputedRef<IReservationDto[]> = computed(() => resList.value)
  const getTables: ComputedRef<ITableDto[]> = computed(() => tableList.value)
  const getLoading: ComputedRef<boolean> = computed(() => resListLoading.value || tableListLoading.value || resCreateLoading.value || createTableLoading.value)
  const getError: ComputedRef<string|undefined> = computed(() => resListError.value ?? resListError.value ?? resCreateError.value ?? createTableError.value)
  const isDeleteLoading: ComputedRef<boolean> = computed(() => resDeleteLoading.value)
  const getDeleteError: ComputedRef<string|undefined> = computed(() => resDeleteError.value)
  const isUpdateLoading: ComputedRef<boolean> = computed(() => resUpdateLoading.value)
  const getUpdateError: ComputedRef<string|undefined> = computed(() => resUpdateError.value)

  const fetchReservations = async () => {
    resList.value = []
    resListLoading.value = true
    resListError.value = undefined

    try {
      const {data} = await restaurantApi.get<IReservationDto[]>('/reservations')

      resList.value = data
    } catch (e) {
      resListError.value = CommonUtils.validateError(e)
    } finally {
      resListLoading.value = false
    }
  }

  const fetchTables = async () => {
    tableList.value = []
    tableListLoading.value = true
    tableListError.value = undefined

    try {
      const {data} = await restaurantApi.get<ITableDto[]>('/tables')

      tableList.value = data
    } catch (e) {
      tableListError.value = CommonUtils.validateError(e)
    } finally {
      tableListLoading.value = false
    }
  }

  const createReservation = async (form: IReservationDto) => {
    resCreateLoading.value = true
    resCreateError.value = undefined

    try {
      await restaurantApi.post('/reservations/new', form)
    } catch (e) {
      resCreateError.value = CommonUtils.validateError(e)
    } finally {
      resCreateLoading.value = false
    }
  }

  const updateReservation = async (id: string, form: IReservationDto) => {
    resUpdateLoading.value = true
    resUpdateError.value = undefined

    try {
      await restaurantApi.put(`/reservations/${id}`, form)
    } catch (e) {
      resUpdateError.value = CommonUtils.validateError(e)
    } finally {
      resUpdateLoading.value = false
    }
  }

  const createTable = async (form: ITableDto) => {
    createTableLoading.value = true
    createTableError.value = undefined

    try {
      await restaurantApi.post('/tables/new', form)
    } catch (e) {
      createTableError.value = CommonUtils.validateError(e)
    } finally {
      createTableLoading.value = false
    }
  }

  const deleteReservation = async (id: string) => {
    resDeleteLoading.value = true
    resDeleteError.value = undefined

    try {
      await restaurantApi.delete(`/reservations/${id}`)
    } catch (e) {
      resDeleteError.value = CommonUtils.validateError(e)
    } finally {
      resDeleteLoading.value = false
    }
  }



  return {
    getError,
    getReservations,
    getTables,
    getLoading,
    isDeleteLoading,
    getDeleteError,
    getUpdateError,
    isUpdateLoading,
    fetchReservations,
    fetchTables,
    createReservation,
    deleteReservation,
    createTable,
    updateReservation
  }
})
