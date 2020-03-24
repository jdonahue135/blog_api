var express = require('express');
var router = express.Router();

// Require controller modules
var admin_controller = require('../controllers/adminController');

/* Handle admin login on POST */
router.post('/login', admin_controller.login);

/* handle author sign up on POST */
router.post('/signup', admin_controller.signup);

module.exports = router;