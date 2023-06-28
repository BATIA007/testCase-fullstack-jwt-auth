import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../service/AuthService";
import axios from "axios";
import { API_URL } from "../http/axios";
import { AuthResponse } from "../models/response/AuthRespone";

export default class Store {
  user = {} as IUser
  isLoading = false
  isAuth = false

  constructor() {
    makeAutoObservable(this)
  }

  setUser(user: IUser) {
    this.user = user
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  async register(email: string, password: string) {
    this.setLoading(true)
    try {
      const response = await AuthService.register(email, password)
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setUser(response.data.user)
      this.setAuth(true)
    } catch (e: any) {
      console.log(e.response?.data?.message)
    } finally {
      setTimeout(() => this.setLoading(false), 1500)
    }
  }

  async login(email: string, password: string) {
    this.setLoading(true)
    try {
      const response = await AuthService.login(email, password)
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setUser(response.data.user)
      this.setAuth(true)
    } catch (e: any) {
      console.log(e?.response?.data?.message)
    } finally {
      setTimeout(() => this.setLoading(false), 1000)
    }
  }

  async logout() {
    this.setLoading(true)
    try {
      await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({} as IUser)
    } catch (e: any) {
      console.log(e.response?.data?.message)
    } finally {
      setTimeout(() => this.setLoading(false), 500)
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setUser(response.data.user)
      this.setAuth(true)
    } catch (e: any) {
      console.log(e?.response?.data?.message)
    } finally {
      setTimeout(() => this.setLoading(false), 300)
    }
  }

}