const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const userRoute = require('./src/routers/userRouter');
const customError = require('./src/utils/customError');
const globalErrorHandler = require('./src/controllers/errorController');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use((req, res, next) => {
  //đấy là 1 middleware
  next();
});

app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

module.exports = app;