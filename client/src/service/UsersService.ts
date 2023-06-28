import { AxiosResponse } from "axios";
import $api from "../http/axios";
import { IUsers } from "../models/IUser";


export default class UsersService {
  static async fetchUsers(): Promise<AxiosResponse<IUsers[]>> {
    const response = await $api.get<IUsers[]>('/users')
    return response
  }
}