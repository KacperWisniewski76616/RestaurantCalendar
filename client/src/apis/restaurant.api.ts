import axios from "axios";

axios.defaults.timeout = 10000

export const restaurantApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api`,
  withCredentials: true
})
