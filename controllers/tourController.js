const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString());

exports.checkID = (req, res, next, val) => {
  if (+val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour ID'
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request missing name or price.'
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getOneTour = (req, res) => {
  console.log(req.params);

  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
    /*results: tours.length,
    data: {
      tours
    }*/
  });
};

exports.createOneTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  });
};

exports.updateOneTour = (req, res) => {
  console.log(req.params);

  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);

  const updatedTour = Object.assign(tour, req.body);
  tours[tours.indexOf(tour)] = updatedTour;

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    })
  });
};

exports.deleteOneTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};