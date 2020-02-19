var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Book = require("./models/book");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var app = express();

mongoose.connect("mongodb://127.0.0.1:27017/Dinosur_Info", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useFindAndModify", false);
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
  })
);
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// =============================================//
// Routes ================//
// address book routessss

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/bookhome", function(req, res) {
  Book.find({}, function(err, show) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { show: show });
    }
  });
});

app.get("/bookhome/new", function(req, res) {
  res.render("new");
});

// adding Book

app.post("/bookhome", function(req, res) {
  var name = req.body.name;
  var age = req.body.age;
  var family = req.body.family;
  var food = req.body.food;
  var image = req.body.image;
  var content = req.body.content;

  var item = {
    name: name,
    age: age,
    family: family,
    food: food,
    image: image,
    content : content
  };
  Book.create(item, function(err, add) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bookhome");
    }
  });
});

//show or view
app.get("/bookhome/:id", function(req, res) {
  Book.findById(req.params.id, function(err, showAll) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { show: showAll });
    }
  });
});
// edit

app.get("/bookhome/:id/edit", function(req, res) {
  Book.findById(req.params.id, function(err, edit) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { show: edit });
    }
  });
});

//update route
app.put("/bookhome/:id", function(req, res) {
  var name = req.body.name;
  var age = req.body.age;
  var family = req.body.family;
  var food = req.body.food;
  var image = req.body.image;
  var content = req.body.content;
  var items = {
    name: name,
    age: age,
    family: family,
    food: food,
    image: image,
    content : content
  };
  Book.findByIdAndUpdate(req.params.id, items, function(err, updateBog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bookhome/" + req.params.id);
    }
  });
}); // delete route

app.delete("/bookhome/:id", function(req, res) {
  Book.findByIdAndDelete(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/bookhome");
    }
  });
});

// AUTH routes
//show sign up form
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, function() {
      res.redirect("/bookhome");
    });
  });
});
// Login Routes

app.get("/login", function(req, res) {
  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/bookhome",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//logout routes

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
//middleware

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(process.env.PORT || 3019, process.env.IP, function() {
  console.log("server started");
});
