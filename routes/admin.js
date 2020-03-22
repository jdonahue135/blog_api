var express = require('express');
var router = express.Router();

const auth = require('../config/auth')

// Require controller modules
var admin_controller = require('../controllers/adminController');

/* Handle admin login on POST */
router.post('/login', admin_controller.login_post);

/* handle blog post on POST */
router.post('/', auth.verifyToken, admin_controller.post_post);

/* GET unposted drafts */
router.get('/drafts', auth.verifyToken, admin_controller.drafts);

/* handle author sign up on POST */
router.post('/signup', admin_controller.signup);

/* handle blog post DELETE */
router.delete('/:postid', auth.verifyToken, admin_controller.post_delete);

/* handle comment DELETE */
router.delete('/:postid/comments/:commentid', auth.verifyToken, admin_controller.comment_delete);

/* handle blog update on PUT */
router.put('/:postid', auth.verifyToken, admin_controller.post_update);

/* handle comment update on PUT */
router.put('/:postid/comments/:commentid', auth.verifyToken, admin_controller.comment_update);


module.exports = router;