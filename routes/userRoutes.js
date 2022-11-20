const express = require('express');

const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);

router.route('/').get(controller.getAllUsers).post(controller.createOneUser);
router
  .route('/:id')
  .get(controller.getOneUser)
  .patch(controller.updateOneUser)
  .delete(controller.deleteOneUser);

module.exports = router;
