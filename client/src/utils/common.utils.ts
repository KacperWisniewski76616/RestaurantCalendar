import {AxiosError} from "axios";

export const validateError = (error: unknown) => {
  let message = ''

  if(error instanceof AxiosError) {
    console.log(error?.response?.data?.message)
    message = error?.response?.data?.message ?? error?.message ?? 'Nieznany błąd'
  } else if(error instanceof Error) {
    message = error?.message ?? 'Nieznany błąd'
  } else {
    message = 'Nieznany błąd'
  }

  return message
}
