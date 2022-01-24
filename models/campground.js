const mongoose = require('mongoose');
let campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }]
});

let Campground = mongoose.model('Campgrounds',campgroundSchema);
module.exports = Campground;