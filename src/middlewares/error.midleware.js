const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Something went wrong";

  // mongoose duplicate key error (email/username already exists)
  if (err.code === 11000) {
    statusCode = 400;
    // message = `${Object.keys(err.keyValue)} already exists`; /err.keyValue tells you which field caused the duplicate, so the message would be something like "email already exists".
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  //2. Validation Error 
  // When your schema has required: true or minlength etc. and the data doesn't match, Mongoose throws a ValidationError automatically before even saving to the database

  // invalid mongo id
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;