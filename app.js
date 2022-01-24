const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      expressSession= require('express-session'),
      methodOverride= require('method-override'),
      flash         = require('connect-flash'),
      Campground    = require('./models/campground'),
      Comment       = require('./models/comment'),
      User          = require('./models/user');

const campgroundRoutes = require('./routes/campground'),
      commentRoutes = require('./routes/comment'),
      indexRoutes = require('./routes/index');



app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

// Mongoose Connect
mongoose.connect('mongodb+srv://yelpcamp:kingmaker@cluster0-y07gq.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true , useUnifiedTopology: true });

//seedDB();

//Passport Configuration
app.use(expressSession({
    secret: "Another Secret Page",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Home Page
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
app.listen(process.env.PORT,process.env.IP);

// app.listen(process.env.IP,function(){
//     console.log("The Yelp Camp Server has Started!!!");
// })

