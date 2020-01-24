const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/author')

module.exports = passport => {    
    passport.use(new LocalStrategy(
        function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    //passwords match, log user in.
                    return done(null, user);
                }
                else {
                    //passwords do not match.
                    return done(null, false, { msg: "Incorrect password" });
                }
            });
        });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}