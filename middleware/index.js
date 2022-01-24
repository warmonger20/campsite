const Campground = require('../models/campground'),
      Comment = require('../models/comment')

let middleware = {};
 
middleware.checkCampgroundOwnerShip = function(req,res,next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err) {
                req.flash('error','Some Wierd Database Error!!!');
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash('error',"You Don't have permission to do that");
                    res.redirect("back");

                }
            }
        });
    } else {
        req.flash('error','Please Login First');
        res.redirect("back");
    }
}  

middleware.checkCommentOwnerShip = function(req,res,next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id,function(err,foundComment) {
            if(err) {
                req.flash('error','Some Wierd Database Error!!!');
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash('error',"You Don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error','Please Login First');
        res.redirect('/login');
    }
}

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','Please Login First');
    res.redirect('/login');
}


module.exports = middleware;