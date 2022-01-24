const express = require('express'),
      router  = express.Router(),
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      middleware = require('../middleware/index');
// Comment Route
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            res.render('comment/new',{Campground:campground});
        }
    });
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn,function(req,res){
        Campground.findById(req.params.id,function(err,campground){
            if(err) {
                console.log(err);
            } else {
                Comment.create(req.body.comment,function(err,comment){
                    if(err) {
                        console.log(err);
                    } else {
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        res.redirect('/campgrounds/' + campground._id);
                    }
                });
            }
        });
});

router.get('/campgrounds/:id/comments/:comment_id/edit',middleware.checkCommentOwnerShip,function(req,res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err) {
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err) {
                    console.log(err);
                } else {
                    res.render('comment/edit',{campground:foundCampground,comment:foundComment});
                }
            });
        }
    });
});

router.put('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwnerShip,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwnerShip,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash('success','Comment has been removed!!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// function checkCommentOwnerShip(req,res,next) {
//     if(req.isAuthenticated()) {
//         Comment.findById(req.params.comment_id,function(err,foundComment) {
//             if(err) {
//                 res.redirect("back");
//             } else {
//                 if(foundComment.author.id.equals(req.user.id)){
//                     next();
//                 } else{
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect('/login');
//     }
// }

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// }

module.exports = router;