const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./models/user')
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
require('dotenv').config();
const flash = require("connect-flash");
const userController = require('./controllers/userController')

const mongoDb = process.env.DATABASE_STRING;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log('locallll')
      const user   = await User.findOne({ username: username });
      if (!user) {
        console.log('user not')
        return done(null, false, { message: "Incorrect username" });
      };
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log('amtchcchhc')
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("homepage", { user: req.user });
});

app.get("/sign-up", (req, res) => 
res.render("user_signup_form", {errors: []}));

app.post('/sign-up', userController.user_signup_post)

app.get('/log-in', (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render('user_login_form', {errorMessage});
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/user-homepage",
    failureRedirect: "/log-in",
    failureFlash: true
  })
);

app.get('/user-homepage', (req, res) => res.render('user_homepage', {user: req.user.username}))

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(8080, () => console.log("app listening on port 8080!"));