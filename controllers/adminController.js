var Post = require('../models/post');
var Author = require('../models/author');

const bcrypt = require('bcrypt');

const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Display admin dashboard page on GET
exports.index = (req, res) => {
    res.send("Not implemented: admin dashboard");
}

//Display admin login form on GET
exports.login = (req, res) => {
    res.send("Not implemented: admin login form");
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
                    res.json({message: 'new author created: ' + new_author.username});
                });
            });
        }
    });
}

//Display unposted drafts on GET
exports.drafts = (req, res) => {
    res.send("Not implemented: list of drafts");
}

//Handle blog post submit on post
exports.post_post = (req, res) => {
    // Validate fields.
    body('title').trim().isLength({ min: 1 }).withMessage('Title must be specified.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Text must be specified.')

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('text').escape()

    // Save post
    const post = new Post({
        title: req.body.title,
        author: 'test_author',
        timestamp: Date.now,
        text: req.body.text,
        published_status: true
    }).save(err => {
        if (err) return next(err);
        res.json(post);
    });
}