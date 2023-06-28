import ApiError from "../exceptions/apiError.js"
import TokenService from '../service/token.js'

export default (req, res, next) => {
  try {
    const accessToken = req.headers.authorization
    if (!accessToken) return next(ApiError.UnAuthorizedError())

    const userData = TokenService.validateAccessToken(accessToken)
    if (!userData) return next(ApiError.UnAuthorizedError())

    req.user = userData
    next()

  } catch (e) {
    return next(ApiError.UnAuthorizedError())
  }
}