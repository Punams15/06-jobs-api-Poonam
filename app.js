require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// DB
const connectDB = require('./db/connect')

// Routers
const authRouter = require('./routes/auth')
const tripsRouter = require('./routes/trips')

// Middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/trips', tripsRouter)

// Errors
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
