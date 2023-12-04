const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const User = require('./models/user')
const user_controller = require('./controllers/userController');
require('dotenv').config();

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_STRING;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

passport.use(
  new LocalStrategy( async (email, password, done) => {
    console.log('local')
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        console.log('Incorrect email');
        return done(null, false, { message: "Incorrect email" });
      };
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        console.log('Incorrect password');
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//Define routes
app.get('/', user_controller.homepage_get);

app.get('/signup', user_controller.user_create_get);
app.post('/signup', user_controller.user_create_post);

app.get('/login', user_controller.user_login_get);
app.post("/login", (req, res, next) => {
  console.log('Login route called');
  const { email, password } = req.body;
  console.log('Email:', email);
  console.log('Password:', password);
  next();
}, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
}));


app.listen(3000, () => console.log("apsp listening on port 3000!"));