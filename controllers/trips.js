const Trip = require('../models/Trip')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

// Create Trip
const createTrip = async (req, res) => {
  req.body.createdBy = req.user.userId
  const trip = await Trip.create(req.body)
  res.status(StatusCodes.CREATED).json({ trip })
}

// Get all trips for logged-in user
const getAllTrips = async (req, res) => {
  const trips = await Trip.find({ createdBy: req.user.userId })
  res.status(StatusCodes.OK).json({ trips, count: trips.length })
}

// Get single trip
const getTrip = async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  })

  if (!trip) {
    throw new NotFoundError('Trip not found')
  }

  res.status(StatusCodes.OK).json({ trip })
}

// Update trip
const updateTrip = async (req, res) => {
  const { destination, startDate, endDate, budget } = req.body

  if (!destination || !startDate || !endDate || !budget) {
    throw new BadRequestError('Fields cannot be empty')
  }

  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!trip) {
    throw new NotFoundError('Trip not found')
  }

  res.status(StatusCodes.OK).json({ trip })
}

// Delete trip
const deleteTrip = async (req, res) => {
  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId,
  })

  if (!trip) {
    throw new NotFoundError('Trip not found')
  }

  res.status(StatusCodes.OK).json({ msg: 'Trip removed' })
}

module.exports = {
  createTrip,
  getAllTrips,
  getTrip,
  updateTrip,
  deleteTrip,
}



//package.json scripts
//start → runs normally.

//dev → runs with nodemon (auto restarts on file changes).

