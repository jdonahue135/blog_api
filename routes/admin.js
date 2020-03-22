var express = require('express');
var router = express.Router();

const auth = require('../config/auth')

// Require controller modules
var admin_controller = require('../controllers/adminController');

/* GET admin dashboard*/
router.get('/', auth.verifyToken, admin_controller.index);

/* GET admin login page */
router.get('/login', admin_controller.login_get);

/* Handle admin login on POST */
router.post('/login', admin_controller.login_post);

/* handle blog post on POST */
router.post('/', admin_controller.post_post);

/* GET unposted drafts */
router.get('/drafts', auth.verifyToken, admin_controller.drafts);

/* handle author sign up on POST */
router.post('/signup', admin_controller.signup);

/* handle blog post DELETE */
router.delete('/:postid', admin_controller.post_delete);

/* handle comment DELETE */
router.delete('/:postid/comments/:commentid', admin_controller.comment_delete);

/* handle blog update on PUT */
router.put('/:postid', admin_controller.post_update);

/* handle comment update on PUT */
router.put('/:postid/comments/:commentid', admin_controller.comment_update);


module.exports = router;