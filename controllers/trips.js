const Trip = require('../models/Trip')
const { NotFoundError } = require('../errors')

// Create Trip
const createTrip = async (req, res) => {
  req.body.createdBy = req.user.userId
  const trip = await Trip.create(req.body)
  res.status(201).json(trip)
}

// Get all trips for logged-in user
const getTrips = async (req, res) => {
  const trips = await Trip.find({ createdBy: req.user.userId })
  res.status(200).json(trips)
}

// Update trip
const updateTrip = async (req, res) => {
  const { id: tripId } = req.params

  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!trip) {
    throw new NotFoundError(`No trip with id ${tripId}`)
  }

  res.status(200).json(trip)
}

// Delete trip
const deleteTrip = async (req, res) => {
  const { id: tripId } = req.params

  const trip = await Trip.findOneAndDelete({
    _id: tripId,
    createdBy: req.user.userId
  })

  if (!trip) {
    throw new NotFoundError(`No trip with id ${tripId}`)
  }

  res.status(200).json({ msg: 'Trip deleted' })
}

module.exports = {
  createTrip,
  getTrips,
  updateTrip,
  deleteTrip
}
