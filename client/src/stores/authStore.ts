import {defineStore} from "pinia";
import {computed, type ComputedRef, ref} from "vue";
import type {IUserDto} from "@/types";
import {CommonUtils} from "@/utils";
import {restaurantApi} from "@/apis";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const authLoading = ref<boolean>(false)
  const userData = ref<IUserDto>()
  const authError = ref<string>()
  const userList = ref<IUserDto[]>([])
  const userListLoading = ref<boolean>(false)
  const userListError = ref<string>()

  const isLogged: ComputedRef<boolean> = computed(() => !!userData.value && !authLoading.value)
  const getUserData: ComputedRef<IUserDto | undefined> = computed(() => userData.value)
  const isAuthLoading: ComputedRef<boolean> = computed(() => authLoading.value)
  const getAuthError: ComputedRef<string| undefined> = computed(() => authError.value)
  const getUserList: ComputedRef<IUserDto[]> = computed(() => userList.value)
  const isUserListLoading: ComputedRef<boolean> = computed(() => userListLoading.value)
  const getUserListError: ComputedRef<string | undefined> = computed(() => userListError.value)

  const login = async (username: string, pass: string) => {
    authLoading.value = true
    authError.value = undefined
    userData.value = undefined

    try {
      const { data } = await restaurantApi.post('/auth/login', {username, pass})

      userData.value = data
    } catch (e) {
      authError.value = CommonUtils.validateError(e)
    } finally {
      authLoading.value = false
    }
  }

  const fetchUserList = async () => {
    userList.value = []
    userListLoading.value = true
    userListError.value = undefined

    try {
      const {data} = await restaurantApi.get('/auth/users')
      userList.value = data
    } catch (e) {
      userListError.value = CommonUtils.validateError(e)
    } finally {
      userListLoading.value = false
    }
  }

  const logout = async () => {
    userData.value = undefined
    await router.push('login')
  }

  return {
    isLogged,
    getUserData,
    getUserList,
    getUserListError,
    getAuthError,
    isUserListLoading,
    isAuthLoading,
    login,
    logout,
    fetchUserList
  }
})
