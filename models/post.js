var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        title: {type: String, required: true, max:  100},
        author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
        timestamp: {type: Date, default: Date.now},
        text: {type: String, required: true, max: 1000},
        published_status: {type: Boolean, required: true}
    }
);

//Virtual for formatted timestamp
PostSchema
.virtual('timestamp_formatted')
.get(function () {
  return moment(this.timestamp).format('LT ll');
});

//Virtual for post url
PostSchema
.virtual('url')
.get(function () {
  return '/posts/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostSchema);