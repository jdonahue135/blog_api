const Post = require('../models/post');

// Display all posts on GET
exports.posts = (req, res, next) => {
    Post.find({}, function (err, posts) {
        if (err) return next(err);
        res.json(posts);
    });
}

// Display individual post page
exports.post_get = (req, res) => {
    Post.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}