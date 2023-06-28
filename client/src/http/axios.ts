import axios from 'axios'
import { AuthResponse } from '../models/response/AuthRespone'

export const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('token') // Acces Token хранить так не очень безопасно, но для примера работы сойдет. В prod его лучше хранить либо в куках, либо в состоянии
  return config
})

$api.interceptors.response.use((config) => config, async (error: any) => {
  const origRequest = error.config
  if (error.status == 401 && error.config && !error.config._isRetry) {
    origRequest._isRetry = true
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })
      localStorage.setItem('token', response.data.accessToken)
      return $api.request(origRequest)
    } catch (e) {
      console.log('Пользователь не авторизован')
    }
  }
  throw error
})

export default $api