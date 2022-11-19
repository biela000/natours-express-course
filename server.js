const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1); // bez close'owania servera, ponieważ exceptions tu łapane nigdy nie będą miały do czynienia z asyncowym procesem servera
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then((con) => {
  //console.log(con.connections);
  console.log('DB connection successful!');
});

const app = require('./app');

// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
