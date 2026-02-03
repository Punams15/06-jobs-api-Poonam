const express = require('express')
const router = express.Router()

const auth = require('../middleware/authentication') // JWT Middleware
const {
  createTrip,
  getAllTrips,
  getTrip,
  updateTrip,
  deleteTrip
} = require('../controllers/trips')

// All routes require authentication
router.post('/', auth, createTrip)
router.get('/', auth, getAllTrips)       //  updated
router.get('/:id', auth, getTrip)        // single trip by ID
router.patch('/:id', auth, updateTrip)
router.delete('/:id', auth, deleteTrip)

module.exports = router



/* Create a trip - only logged-in users can do this
router.post('/', auth, async (req, res) => {
  req.body.createdBy = req.user.userId
  const trip = await Trip.create(req.body)
  res.status(201).json(trip)
})

// Get all trips - only trips for this user
router.get('/', auth, async (req, res) => {
  const trips = await Trip.find({ createdBy: req.user.userId })
  res.status(200).json(trips)
})

// Update trip
router.patch('/:id', auth, async (req, res) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!trip) return res.status(404).json({ msg: 'Trip not found' });
  res.status(200).json(trip);
});

// Delete trip
router.delete('/:id', auth, async (req, res) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
  if (!trip) return res.status(404).json({ msg: 'Trip not found' });
  res.status(200).json({ msg: 'Trip deleted' });
});

module.exports = router;



//A)Auth middleware applied consistently

//1)router.post('/', auth, ... )
//2)router.get('/', auth, ... )
//3)router.patch('/:id', auth, ... )
//4)router.delete('/:id', auth, ... )


//All routes require a valid JWT.
//Users can only access their own trips.

//B)Access control enforced
//createdBy: req.user.userId
//Ensures users can only create, update, delete, or view their own trips.

//c)Proper HTTP status codes

//201 → Created
//200 → Success
//404 → Not found

//d)Clean and readable

//Easy to maintain.
//Follows standard REST patterns for CRUD operations.

//Optional improvement for final projects
//router.post('/', auth, createTrip)
//router.get('/', auth, getTrips)
//router.patch('/:id', auth, updateTrip)
//router.delete('/:id', auth, deleteTrip) */
