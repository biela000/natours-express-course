const express = require('express');

const controller = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

/*router.param('id', controller.checkID);*/
router
  .route('/top-5-cheap')
  .get(controller.aliasTopTours, controller.getAllTours);

router.route('/stats').get(controller.getTourStats);
router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, controller.getAllTours)
  .post(controller.checkBody, controller.createOneTour);
router
  .route('/:id')
  .get(controller.getOneTour)
  .patch(controller.updateOneTour)
  .delete(controller.deleteOneTour);

module.exports = router;
