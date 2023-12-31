import mysql2 from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise()

export default pool