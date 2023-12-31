import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthRespone";
import $api from "../http/axios";


export default class AuthService {
  static async register(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/register', { email, password })
  }

  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/login', { email, password })
  }

  static async logout(): Promise<void> {
    return $api.get('/logout')
  }
}