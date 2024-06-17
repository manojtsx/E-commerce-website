const express = require('express');
const router = express.Router();
const authController = require('../controller/auth-controller');

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
router.route("/user").get(authController.getUser);

module.exports = router;