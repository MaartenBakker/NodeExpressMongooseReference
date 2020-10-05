const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// CATCH UNHANDLED ROUTES, CODE IS REACHED IF URL MATCHES NO VALID ROUTES

// app.all catches all types of HTML requests
app.all('*', (req, res, next) => {
  // argument for Next is always treated as an Error by Express. All other middleware will be skipped, straight to error handling.
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
