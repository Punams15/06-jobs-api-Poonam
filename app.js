require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// Security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// connectDB
const connectDB = require('./db/connect')

// Routers
const authRouter = require('./routes/auth')
const tripsRouter = require('./routes/trips')

// Middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Parse JSON
app.use(express.json())

// Security middleware
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)

// Serve public folder for front-end
app.use(express.static("public"));

// API Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/trips', tripsRouter)

// Error handling
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Start server
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


/*A few notes to make sure it works as expected:

Static Front-End:
app.use(express.static("public")); will serve  index.html and all other files in the public/ folder. This must be above the API routes and error handlers (which it is).

API Routes:
 /api/v1/auth and /api/v1/trips routes are set up correctly. For this assignment, we’ll be calling /api/v1/trips from the front end using fetch().

Error Handling:
notFoundMiddleware and errorHandlerMiddleware are at the end — perfect.

Port:
Make sure you go to http://localhost:5000 if your .env has PORT=5000.

Next step:
create the front-end files in the public/ folder (index.html, index.js, etc.) and test that index.html loads when you visit localhost:5000. */