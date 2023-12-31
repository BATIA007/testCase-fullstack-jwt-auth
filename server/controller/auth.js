import ApiError from "../exceptions/apiError.js"
import UserService from "../service/user.js"
import { validationResult } from "express-validator"


class UserConroller {
  async register(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const { email, password } = req.body
      const userData = await UserService.register(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, htttpOnly: true })
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }

      const { email, password } = req.body
      const userData = await UserService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken), { maxAge: 30 * 24 * 60 * 60 * 1000, htttpOnly: true }
      return res.json(userData)

    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      await UserService.logout(refreshToken)
      res.clearCookie('refreshToken')

      return res.json({ message: 'Вы вышли из системы' })
    } catch (error) {
      next(error)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await UserService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, htttpOnly: true })
      return res.json(userData)

    } catch (error) {
      next(error)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers()
      return res.json(users)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserConroller()