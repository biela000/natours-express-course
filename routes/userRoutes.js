const express = require('express');

const controller = require('../controllers/userController');

const router = express.Router();

router.route('/').get(controller.getAllUsers).post(controller.createOneUser);
router.route('/:id').get(controller.getOneUser).patch(controller.updateOneUser).delete(controller.deleteOneUser);

module.exports = router;