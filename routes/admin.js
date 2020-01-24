var express = require('express');
var router = express.Router();

// Require controller modules
var admin_controller = require('../controllers/adminController');

/* GET admin dashboard*/
router.get('/', admin_controller.index);

/* GET admin login page */
router.get('/login', admin_controller.login);

/* GET unposted drafts */
router.get('/drafts', admin_controller.drafts);

/* handle author sign up on POST */
router.post('/signup', admin_controller.signup);

module.exports = router;