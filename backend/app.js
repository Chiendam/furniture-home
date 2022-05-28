const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const userRoute = require('./src/routers/userRouter');
const categoryRoute = require('./src/routers/categoryRouter');
const customError = require('./src/utils/customError');
const globalErrorHandler = require('./src/controllers/errorController');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use(morgan('dev'));
// app.use(express.json());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
  );
  
app.use((req, res, next) => {
  //đấy là 1 middleware
  next();
});
  
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);

module.exports = app;