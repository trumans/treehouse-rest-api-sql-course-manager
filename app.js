'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;

// Connect to database
sequelize
  .authenticate()
  .then(() => { console.log('Connected to database'); })
  .catch((err) => {
    console.log('Failed to connect to database'); console.log(err); 
  });

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// setup routes and related middleware
app.use(express.json());

const users = require('./routes/users'); 
const courses = require('./routes/courses');
app.use('/api/users', users);
app.use('/api/courses', courses);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

