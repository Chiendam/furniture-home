const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.route('/login').post(authController.login)
router.route('/signup').post(authController.signup)
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.put('/updatePassword', authController.protect, authController.updatePassword);
router.put('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
    .get(authController.protect, userController.getAll)
    .post(userController.create)

router.
  route('/:id')
    .put(userController.update)
    .delete(authController.protect, authController.restrictTo('admin', 'manager'), userController.delete)

module.exports = router;
