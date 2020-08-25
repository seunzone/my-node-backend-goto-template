const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
// const fileupload = require('express-fileupload')
const helmet = require('helmet')
const xss = require('xss-clean')
// const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')


const DBConnection = require('./config/db')

dotenv.config({ path: './config/.env' })

DBConnection()
const app = express()

app.use(express.json())

app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Enable CORS
app.use(cors())
// Prevent http param pollution
app.use(hpp())

app.use(express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(
    `We are live on ${process.env.NODE_ENV} mode on port ${PORT}`.bgMagenta.bold
  )
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})