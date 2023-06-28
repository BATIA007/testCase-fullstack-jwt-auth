import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import router from './router/auth.js'
import errorMiddleware from "./middlewares/errorMiddleware.js"

const app = express()

const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server was started on ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
