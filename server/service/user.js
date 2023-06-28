import pool from "../db.js"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import TokenService from './token.js'
import MailService from './mail.js'
import UserDto from "../dtos/userDto.js"
import UsersDto from '../dtos/usersDto.js'
import ApiError from "../exceptions/apiError.js"


class UserService {
  async register(email, password) {
    const sqlCandidate = 'SELECT * FROM users WHERE email = ?'
    const [[candidate]] = await pool.query(sqlCandidate, [email])

    if (candidate) {
      throw ApiError.BadRequest('Такой пользователь уже существует')
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuidv4()

    const sqlCreate = 'INSERT INTO users (email, password, activationLink) VALUES ?'
    await pool.query(sqlCreate, [[[email, hashPassword, activationLink]]])
    await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

    const [[user]] = await pool.query(sqlCandidate, [email])

    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async activate(activationLink) {
    const sqlSearch = 'SELECT * FROM users WHERE activationLink = ?'
    const [[user]] = await pool.query(sqlSearch, [activationLink])
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации')
    }

    const sqlPut = 'UPDATE users SET isActivated = ?, activationLink = ? WHERE activationLink = ?'
    await pool.query(sqlPut, [true, '', activationLink])
  }

  async login(email, password) {
    const sqlCandidate = 'SELECT * FROM users WHERE email = ?'
    const [[user]] = await pool.query(sqlCandidate, [email])

    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден')
    }

    const isPassCorrect = await bcrypt.compare(password, user.password)
    if (!isPassCorrect) {
      throw ApiError.BadRequest('Пользователь не найден')
    }

    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnAuthorizedError()
    }

    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenDb = TokenService.findToken(refreshToken)

    if (!userData || !tokenDb) {
      throw ApiError.UnAuthorizedError()
    }

    const sqlUser = 'SELECT * FROM users WHERE id = ?'
    const [[user]] = await pool.query(sqlUser, [userData.id])
    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const message = await TokenService.removeToken(refreshToken)
    return message
  }

  async getUsers() {
    const sql = 'SELECT * FROM users'
    const [users] = await pool.query(sql)
    const arrUsers = []
    for (let user of users) {
      arrUsers.push(new UsersDto(user))
    }
    return arrUsers
  }
}

export default new UserService()