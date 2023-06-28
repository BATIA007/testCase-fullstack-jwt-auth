import { Router } from "express";
import UserConroller from "../controller/auth.js"
import { body } from 'express-validator'
import authMiddleware from "../middlewares/authMiddleware.js";


const router = new Router()

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 20 }),
  UserConroller.register)
router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 20 }),
  UserConroller.login)
router.get('/activate/:link', UserConroller.activate)
router.get('/logout', UserConroller.logout)
router.get('/refresh', UserConroller.refresh)
router.get('/users', authMiddleware, UserConroller.getUsers)

export default router