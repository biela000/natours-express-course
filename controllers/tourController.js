/*const fs = require('fs');*/
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/*exports.checkID = (req, res, next, val) => {
  if (+val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour ID',
    });
  }

  next();
};*/

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request missing name or price.',
    });
  }

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const { query } = features;

  const tours = await query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
    /*results: tours.length,
    data: {
      tours,
    },*/
  });
});

exports.getOneTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new AppError('Tour of given ID does not exist in the database', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

  /* const id = +req.params.id;*/
  /*const tour = tours.find((el) => el.id === id);*/
});

exports.createOneTour = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  /*const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };*/

  /*tours.push(newTour);*/
  /*  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {

    }
  );*/
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
    /*data: {
      tour: newTour,
    },*/
  });
});

exports.updateOneTour = catchAsync(async (req, res, next) => {
  /*const id = +req.params.id;*/
  /*const tour = tours.find((el) => el.id === id);

  const updatedTour = Object.assign(tour, req.body);
  tours[tours.indexOf(tour)] = updatedTour;*/

  /*  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {

    }
  );*/
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(
      new AppError('A tour of given ID does not exist in the database', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
    /*data: {
      tour: updatedTour,
    },*/
  });
});

exports.deleteOneTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  if (!deletedTour) {
    return next(
      new AppError('A tour of given ID does not exist in the database', 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numOfTours: { $sum: 1 },
        numOfRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourSum: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $sort: {
        tourSum: -1,
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
