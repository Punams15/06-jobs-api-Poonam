const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the travel routes
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth

//what the middleware does?
//JWT Middleware → This is the authentication.js file that checks the JWT token.
//Protect routes → Only users with a valid token can access the route. Anyone else gets blocked.
//Its a Security gate as a checkpoint or guard at the entrance of a route.

//Checks for Authorization header and makes sure it starts with Bearer.

//Splits the token from the header.

//Verifies the token using JWT_SECRET.

//Attaches req.user = { userId, name } so your Trip routes can use it.

//Throws UnauthenticatedError if invalid.