import {defineStore} from "pinia";
import {computed, type ComputedRef, ref} from "vue";
import type {IUserDto} from "@/types";

export const useAuthStore = defineStore('auth', () => {
  const authLoading = ref<boolean>(false)
  const userData = ref<IUserDto>()

  const isLogged: ComputedRef<boolean> = computed(() => !!userData.value && !authLoading.value)
  const getUserData: ComputedRef<IUserDto | undefined> = computed(() => userData.value)



  return {
    isLogged,
    getUserData
  }
})
