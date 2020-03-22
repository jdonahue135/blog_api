var Post = require('../models/post');
var Author = require('../models/author');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const auth = require('../config/auth');

//Display admin dashboard page on GET
exports.index = (req, res) => {
    res.send("Not implemented: admin dashboard");
}

//Display admin login form on GET
exports.login_get = (req, res) => {
    res.send("Not implemented: admin login form");
}

// Handle login on POST
exports.login_post = function(req, res, next) {
    Author.findOne({username : req.body.username}, (err, user) => {
        if (err) return next(err);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) return next(err);
            else {
                jwt.sign({user}, 'secretkey', (err, token) => {
                    console.log(token)
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
                    res.json({message: 'new author created: ' + new_author.username});
                });
            });
        }
    });
}

//Display unposted drafts on GET
exports.drafts = (req, res, next) => {
    console.log(req.token)
    //verify token
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
    })
    Post.find({'published_status': false}, function (err, posts) {
        if (err) return next(err);
        res.json(posts);
    });        
}