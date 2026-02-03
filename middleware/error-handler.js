const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors"); // destructure the class

const errorHandlerMiddleware = (err, req, res, next) => {
  // Handle custom errors thrown in controllers first
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  // Default error object
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate key error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Invalid MongoDB ID
  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;




//Make sure all my controllers (auth, trips, etc.) throw CustomError where needed.

//Test all CRUD operations in Postman to verify:

//Invalid IDs → 404

//Missing required fields → 400

//Duplicate entries → 400

//Any unexpected error → 500

//Once that works,  error handling is fully complete.
