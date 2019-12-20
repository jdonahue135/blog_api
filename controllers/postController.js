const Post = require('../models/post');
const Comment = require('../models/comment');

const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display all posts on GET
exports.posts = (req, res, next) => {
    Post.find({'published_status': true}, function (err, posts) {
        if (err) return next(err);
        res.json(posts);
    });
}

// Display individual post page
exports.post_get = (req, res, next) => {
    Post.findById(req.params.postid, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}

// Handle comment on POST
exports.comment = (req, res, next) => {
    
    // Validate fields.
    body('author').trim().isLength({ min: 1 }).withMessage('Author must be specified.')
        .isAlphanumeric().withMessage('Author has non-alphanumeric characters.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Comment must be specified.')

    // Sanitize fields.
    sanitizeBody('author').escape(),
    sanitizeBody('text').escape()

    //save comment
    const comment = new Comment({
        author: req.body.author,
        text: req.body.text,
        post: req.parasms.postid
    }).save(err => {
        if (err) return next(err);
        res.json(comment);
    });
}

// Display all comments of a post on GET
exports.comments_get = (req, res, next) => {
    Comment.find({'post.id': req.params.postid}, function (err, comments) {
        if (err) return next(err);
        res.json(comments);
    });
}

// Display specific comment of a post on GET
exports.comment_get = (req, res, next) => {
    res.send("Not implemented");
}