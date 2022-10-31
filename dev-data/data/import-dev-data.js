const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path: `${__dirname}/../../config.env` });

mongoose.connect(process.env.DATABASE_LOCAL);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`).toString()
)
  .map((tour) => Object.assign(tour, { id: null }))
  .filter((_, index) => index < 9);

const importData = async () => {
  await Tour.create(tours);
};

const deleteData = async () => {
  await Tour.deleteMany();
};

if (process.argv.find((el) => el === '--import')) {
  importData().then(() => {
    console.log('Data imported');
    process.exit();
  });
}

if (process.argv.find((el) => el === '--delete')) {
  deleteData().then(() => {
    console.log('Data deleted');
    process.exit();
  });
}
