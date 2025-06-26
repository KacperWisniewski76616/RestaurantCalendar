import {AxiosError} from "axios";

export const validateError = (error: unknown) => {
  let message = ''
  if(error instanceof AxiosError) {
    message = error?.request?.data?.message ?? error?.message ?? 'Nieznany błąd'
  } else if(error instanceof Error) {
    message = error?.message ?? 'Nieznany błąd'
  } else {
    message = 'Nieznany błąd'
  }

  return message
}
