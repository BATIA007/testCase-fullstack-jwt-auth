import jwt from 'jsonwebtoken'
import pool from '../db.js'

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

    return {
      accessToken, refreshToken
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const sqlToken = 'SELECT * FROM tokens WHERE userId = ?'
    const [[tokenData]] = await pool.query(sqlToken, [userId])

    if (tokenData) {
      const sqlPut = 'UPDATE tokens SET refreshToken = ? WHERE userId = ?'
      await pool.query(sqlPut, [refreshToken, userId])
      return
    }

    const sqlCreate = 'INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)'
    await pool.query(sqlCreate, [userId, refreshToken])
  }

  async findToken(refreshToken) {
    const sqlToken = 'SELECT refreshToken FROM tokens WHERE refreshToken = ?'
    const [[token]] = await pool.query(sqlToken, [refreshToken])
    return token
  }

  async removeToken(refreshToken) {
    const sqlRemove = 'DELETE FROM tokens WHERE refreshToken = ?'
    await pool.query(sqlRemove, [refreshToken])
    return 'Токен успешео удален'
  }
}

export default new TokenService()