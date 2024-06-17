const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');

router.route('/users').get(userController.getAllUsers);
router.route('/:id').get(userController.getUserById);
router.route('/add').post(userController.addUser);
router.route('/edit/:id').put(userController.editUserById);
router.route('/delete/:id').delete(userController.deleteUserById);

module.exports = router;