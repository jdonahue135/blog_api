var User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Handle login on POST
exports.login = function(req, res, next) {
    User.findOne({username : req.body.username}, (err, user) => {
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

    //Validate input
    if (req.body.username == '') {
        res.json({message: 'username must be specified'})
    }
    if (req.body.password == '') {
        res.json({message: 'password must be specified'})
    }

    //Verify that username does not already exist
    User.findOne( { username: req.body.username }, (err, user) => {
        if (err) return next(err);
        if (user) {
            res.json({message: 'username already exists'});
        }
        if (!user) {
            //Save new user
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) return next(err);
                const new_user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                })
                new_user.save(err => {
                    if (err) return next(err);
                });
                res.json({message: 'new admin created: ' + new_user.username});
            });
        }
    });
}

