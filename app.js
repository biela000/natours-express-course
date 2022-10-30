const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE (1)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTERS (2)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/*app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getOneTour);
app.post('/api/v1/tours', createOneTour);
app.patch('/api/v1/tours/:id', updateOneTour);
app.delete('/api/v1/tours/:id', deleteOneTour);*/

module.exports = app;
