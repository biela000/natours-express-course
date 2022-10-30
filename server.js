const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then((con) => {
  //console.log(con.connections);
  console.log('DB connection successful!');
});

const app = require('./app');

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
