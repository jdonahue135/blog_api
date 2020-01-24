var express = require('express');
var router = express.Router();

// Require Controller Functions
var post_controller = require('../controllers/postController');

/* Get all posts */
router.get('/', post_controller.posts);

/* handle blog post on POST */
router.post('/', post_controller.post_post);

/* GET individual post page. */
router.get('/:postid', post_controller.post_get);

/* POST comment to individual post page. */
router.post('/:postid', post_controller.comment);

/* GET comments on individual post. */
router.get('/:postid/comments', post_controller.comments_get);

/* GET specific comment on individual post. */
router.get('/:postid/comments/:commentid', post_controller.comment_get);

/* handle blog post DELETE */
router.delete('/:postid', post_controller.post_delete);

/* handle comment DELETE */
router.delete('/:postid/comments/:commentid', post_controller.comment_delete);

/* handle blog update on PUT */
router.put('/:postid', post_controller.post_update);

/* handle comment update on PUT */
router.put('/:postid/comments/:commentid', post_controller.comment_update);

module.exports = router;