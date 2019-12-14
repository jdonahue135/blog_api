var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {
        author: {type: String, required: true},
        timestamp: {type: Date, default: Date.now},
        text: {type: String, required: true, max: 100},
        post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    }
);

//Virtual for formatted timestamp
CommentSchema
.virtual('timestamp_formatted')
.get(function () {
  return moment(this.timestamp).format('LT ll');
});

//Virtual for comment url
CommentSchema
.virtual('url')
.get(function () {
  return '/comments/' + this._id;
});

//Export model
module.exports = mongoose.model('Comment', CommentSchema);