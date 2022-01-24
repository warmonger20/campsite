const express = require('express'),
      router  = express.Router(),
      Campground = require('../models/campground'),
      middleware = require('../middleware/index');
// Index Page
router.get('/campgrounds',function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campground/campgrounds',{Campgrounds:allCampgrounds});
        }
    });
});

router.post('/campgrounds',middleware.isLoggedIn,function(req,res){
    let a = req.body.title;
    let b = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username 
    }
    let newCampground = {
        title: a,
        image: b,
        description: description,
        author: author
    }
    Campground.create(newCampground,function(err,campground){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// New 
router.get('/campgrounds/new',middleware.isLoggedIn,function(req,res){
    res.render('campground/new');
});

// Show 
router.get('/campgrounds/:id',function(req,res) {
    console.log(req.user);
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,campgroundInfo){
        if(err) {
            console.log(err);
        } else {
            res.render('campground/show',{Campground:campgroundInfo});
        }
    });    
});

router.get('/campgrounds/:id/edit',middleware.checkCampgroundOwnerShip,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err) {
            res.redirect('campground/' + req.params.id);
        } else {
            res.render('campground/edit',{campground:foundCampground});
        }
    });
});

router.put('/campgrounds/:id',middleware.checkCampgroundOwnerShip,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/campgrounds/:id',middleware.checkCampgroundOwnerShip,function(req,res){
    
    Campground.findByIdAndRemove(req.params.id,function(err,removedCampground){
        if(err) {
            res.redirect('/campgrounds');
        } else {
            Comment.deleteMany({_id:{$in: removedCampground.comments}},function(err) {
                if(err) {
                    res.redirect('/campgrounds');
                } else {
                    res.redirect('/campgrounds');
                }
            });
        }
    });
});

// function checkCampgroundOwnerShip(req,res,next) {
//     if(req.isAuthenticated()) {
//         Campground.findById(req.params.id,function(err,foundCampground){
//             if(err) {
//                 res.redirect("back");
//             } else {
//                 if(foundCampground.author.id.equals(req.user.id)) {
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }    

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// }


module.exports = router;