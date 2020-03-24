var express = require('express');
var router = express.Router();

const auth = require('../config/auth')

// Require Controller Functions
var post_controller = require('../controllers/postController');

/* Get all posts */
router.get('/', post_controller.posts);

/* handle blog post on POST */
router.post('/', auth.verifyToken, post_controller.post);

/* GET individual post page. */
router.get('/:postid', post_controller.post_get);

/* handle blog update on PUT */
router.put('/:postid', auth.verifyToken, post_controller.post_update);

/* handle blog post DELETE */
router.delete('/:postid', auth.verifyToken, post_controller.post_delete);

/* POST comment to individual post page. */
router.post('/:postid', post_controller.comment);

/* GET comments on individual post. */
router.get('/:postid/comments', post_controller.comments_get);

/* GET specific comment on individual post. */
router.get('/:postid/comments/:commentid', post_controller.comment_get);

/* handle comment update on PUT */
router.put('/:postid/comments/:commentid', auth.verifyToken, post_controller.comment_update);

/* handle comment DELETE */
router.delete('/:postid/comments/:commentid', auth.verifyToken, post_controller.comment_delete);

/* GET unposted drafts */
router.get('/drafts', auth.verifyToken, post_controller.drafts);

module.exports = router;