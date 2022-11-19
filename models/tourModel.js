const mongoose = require('mongoose');
const validator = require('validator');
// const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
      validate: {
        validator: function () {
          return this.name !== 'DYSZYSŁAW';
        },
        message: 'DYSZYSŁAW',
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      validate: [validator.isAlpha, 'Difficulty must be made of letters'],
      // enum: ['easy', 'medium', 'difficult'],
      //validate: { values: ['easy', 'medium', 'difficult'], message: 'Must be one of the values' }
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      selected: false,
    },
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// RUNS BEFORE .save() AND .create()
/*
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});
*/

tourSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  this.find({ secret: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`The whole query took ${Date.now() - this.start}`);
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
