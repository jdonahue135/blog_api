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

//Handle blog post submit on POST
exports.post = (req, res, next) => {

    // Validate fields.
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('author').trim().isLength({ min: 1 }).withMessage('Author must be specified.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Text must be specified.')

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('author').escape(),
    sanitizeBody('text').escape()

    //Validate input
    if (req.body.title == '') {
        res.json({message: 'title must be specified'});
    }
    if (req.body.author == '') {
        res.json({message: 'author must be specified'});
    }
    if (req.body.text == '') {
        res.json({message: 'text must be specified'});
    }
    if (typeof(req.body.published_status) !== 'boolean') {
        res.json({message: 'published status must be boolean'});
    }

    // Save post
    const new_post = new Post({
        title: req.body.title,
        author: req.body.author,
        text: req.body.text,
        published_status: req.body.published_status
    })
    new_post.save(err => {
        if (err) return next(err);
    });
    if (new_post.published_status == false) {
        res.json({message: 'new draft saved: ' + new_post.title});
    }
    else {
        res.json({message: 'new post published: ' + new_post.title});
    }
}

// Display individual post page
exports.post_get = (req, res, next) => {
    Post.findById(req.params.postid, function (err, post) {
        if (err) return next(err);
        if (!post || post.published_status == false) {
            res.json({message: "Post does not exist"});
            next();
        }
        else {
            res.json(post);
        }
    });
}

//Handle blog update on PUT
exports.post_update = (req, res, next) => {
    
    // Validate fields.
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Text must be specified.')

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('text').escape()

    //Validate input
    if (req.body.title == '') {
        res.json({message: 'title must be specified'});
    }
    if (req.body.text == '') {
        res.json({message: 'text must be specified'});
    }
    if (typeof(req.body.published_status) !== 'boolean') {
        res.json({message: 'published status must be boolean'});
    }

    Post.findByIdAndUpdate(req.params.postid, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
        });
}

// Handle post DELETE
exports.post_delete = (req, res, next) => {
    Comment.find({ 'post': req.params.postid }, function (err, post_comments) {
        if (err) return next(err);
        for (comment in post_comments) {
            Comment.findByIdAndRemove(post_comments[comment]._id, function (err, the_comment) {
                if (err) return next(err);
            })
        }
    });
    Post.findByIdAndRemove(req.params.postid, function (err, post) {
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

    //Check if post in a draft
    if (req.params.postid.published_status == false) {
        res.json({message: 'Post does not exist, no comment created'});
        next();
    }

    //save comment
    const comment = new Comment({
        author: req.body.author,
        text: req.body.text,
        post: req.params.postid
    }).save(err => {
        if (err) return next(err);
        res.json({message: 'Comment created'});
    });
}

// Display all comments of a post on GET
exports.comments_get = (req, res, next) => {
    Comment.find({'post': req.params.postid}, function (err, comments) {
        if (err) return next(err);
        res.json(comments);
    });
}

// Display specific comment of a post on GET
exports.comment_get = (req, res, next) => {
    Comment.findById(req.params.commentid, function (err, comment) {
        if (err) return next(err);
        res.json(comment);
    });
}

//Handle comment update on PUT
exports.comment_update = (req, res, next) => {

    // Validate
    body('text').trim().isLength({ min: 1 }).withMessage('Comment must be specified.')

    // Sanitize
    sanitizeBody('text').escape()

    // Validate on Surver side
    if (req.body.text == '') {
        res.json({message: 'text must be specified'});
    }

    Comment.findByIdAndUpdate(req.params.commentid, req.body, function (err, comment) {
            if (err) return next(err);
            res.json(comment);
        });
}

// Handle comment DELETE
exports.comment_delete = (req, res, next) => {
    Comment.findByIdAndRemove(req.params.commentid, function (err, comment) {
        if (err) return next(err);
        res.json(comment);
    });
}

//Display unposted drafts on GET
exports.drafts = (req, res, next) => {
    Post.find({'published_status': false}, function (err, posts) {
        if (err) return next(err);
        res.json(posts);
    });
}