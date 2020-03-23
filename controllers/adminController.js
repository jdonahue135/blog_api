var Post = require('../models/post');
var Author = require('../models/author');
const Comment = require('../models/comment');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Handle login on POST
exports.login_post = function(req, res, next) {
    Author.findOne({username : req.body.username}, (err, user) => {
        if (err) return next(err);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) return next(err);
            else {
                jwt.sign({user}, process.env.JWT_KEY, (err, token) => {
                    if (err) return next(err);
                    res.json({token});
                });
            }
        })
    })
}

// Handle sign up on POST
exports.signup = (req, res, next) => {
    
    // Validate fields.
    body('username').trim().isLength({ min: 1 }).withMessage('Username must be specified.')
        .isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),
    body('password').trim().isLength({ min: 1 }).withMessage('Password must be specified.')
        .isAlphanumeric().withMessage('Password has non-alphanumeric characters.')

    // Sanitize fields.
    sanitizeBody('username').escape(),
    sanitizeBody('password').escape()

    //Verify that username does not already exist
    Author.findOne( { username: req.body.username }, (err, author) => {
        if (err) return next(err);
        if (author) {
            res.json({message: 'username already exists'});
        }
        if (!author) {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) return next(err);
                const new_author = new Author({
                    username: req.body.username,
                    password: hashedPassword,
                }).save(err => {
                    if (err) return next(err);
                });
                res.json({message: 'new author created'});

            });
        }
    });
}

//Handle blog post submit on POST
exports.post_post = (req, res, next) => {

    // Validate fields.
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Text must be specified.')

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('text').escape()

    // Save post
    const new_post = new Post({
        title: req.body.title,
        author: req.body.author,
        text: req.body.text,
        published_status: req.body.published_status
    }).save(err => {
        if (err) return next(err);
        res.json({message: 'new post created'});
    });
}

//Display unposted drafts on GET
exports.drafts = (req, res, next) => {
    Post.find({'published_status': false}, function (err, posts) {
        if (err) return next(err);
        res.json(posts);
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

// Handle comment DELETE
exports.comment_delete = (req, res, next) => {
    Comment.findByIdAndRemove(req.params.commentid, function (err, comment) {
        if (err) return next(err);
        res.json(comment);
    });
}

//Handle post update on PUT
exports.post_update = (req, res, next) => {
    
    // Validate fields.
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Text must be specified.')

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('text').escape()

    Post.findByIdAndUpdate(req.params.postid, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
        });
}

//Handle comment update on PUT
exports.comment_update = (req, res, next) => {

    // Validate fields.
    body('author').trim().isLength({ min: 1 }).withMessage('Author must be specified.')
        .isAlphanumeric().withMessage('Author has non-alphanumeric characters.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Comment must be specified.')

    // Sanitize fields.
    sanitizeBody('author').escape(),
    sanitizeBody('text').escape()

    Comment.findByIdAndUpdate(req.params.commentid, req.body, function (err, comment) {
            if (err) return next(err);
            res.json(comment);
        });
}