const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

// Register
const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email, and password')
  }

  const user = await User.create({ name, email, password })
  const token = user.createJWT()

  res.status(201).json({
    user: { name: user.name, email: user.email },
    token
  })
}

// Login
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()

  res.status(200).json({
    user: { name: user.name, email: user.email },
    token
  })
}

module.exports = { register, login }

//This works with:

//models/User.js

//JWT

//bcrypt

//existing routes/auth.js

//Uses controllers pattern

//Proper error handling

//Secure (hashed passwords, JWT)

//Matches instructor style