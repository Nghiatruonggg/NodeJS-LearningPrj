// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log('Uncaught Exceptopm');

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log('Unhandled Rejection');
  server.close(() => {
    process.exit(1);
  });
});
