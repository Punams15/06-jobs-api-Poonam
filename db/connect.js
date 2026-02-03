//Updated connectDB.js for Mongoose 9+

const mongoose = require('mongoose');

const connectDB = async (url) => {
  try {
    await mongoose.connect(url); // no deprecated options
    console.log('MongoDB connected'); // log success
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // exit process if DB fails to connect
  }
};

module.exports = connectDB;




//Mongoose 6+ does not support below so chnaged to above
/*const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB */
