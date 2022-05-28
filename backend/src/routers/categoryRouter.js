const express = require('express');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

const router = express.Router({mergeParams: true});

router.route('/')
  .get(categoryController.getAll)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.setUserId,
    categoryController.validateCreate,
    categoryController.createOne
  );

router.route('/:id')
    .get(categoryController.getOne)
    .put(
      authController.protect,
      authController.restrictTo('admin'),
      categoryController.setUserId,
      categoryController.updateOne,
    )
    .delete(
      authController.protect,
      authController.restrictTo('admin'),
      categoryController.deleteOne
    );

module.exports = router;
