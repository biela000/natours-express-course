const express = require('express');

const controller = require('../controllers/tourController');

const router = express.Router();

/*router.param('id', controller.checkID);*/

router
  .route('/')
  .get(controller.getAllTours)
  .post(controller.checkBody, controller.createOneTour);
router
  .route('/:id')
  .get(controller.getOneTour)
  .patch(controller.updateOneTour)
  .delete(controller.deleteOneTour);

module.exports = router;
