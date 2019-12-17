var express = require('express');
var router = express.Router();

// Require Controller Functions
var post_controller = require('../controllers/postController');

/* Get all posts */
router.get('/', post_controller.posts);

/* GET individual post page. */
router.get('/:postid', post_controller.post_get);

/* POST comment to individual post page. */
router.post('/:postid', post_controller.comment);

module.exports = router;