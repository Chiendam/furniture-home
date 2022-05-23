const customError = require('./../utils/customError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new customError(message, 400);
}

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new customError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new customError(message, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
  });
}

const sendErrorProd = (err, res) => {
  if(err.isOperational){
      res.status(err.statusCode).json({
          status: err.status,
          message: err.message
      });
  } else {
      // 1. log err 
      console.error(`ERROR ⚡`, err);

      // 2. send generic message
      res.status(500).json({
          status: 'error',
          message:'Something went very wrong',
      });
  }
}

const handleJWTError = (err) => new customError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () => new customError('You token has expired. Please log in again.', 401)

//Có đói số err để phân biệt đây là middleware xử lý lỗi
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log(err.stack);
  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = {...err};
    if(err.name == 'CastError') error = handleCastErrorDB(error);
    if(err.code === 11000) error = handleDuplicateFieldsDB(error); 
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if(err.name === 'TokenExpiredError') error = handleTokenExpiredError(error);
  }
}