const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Replace 'your_google_client_id' and 'your_google_client_secret' with your actual values
passport.use(new GoogleStrategy({
  clientID: 'your_google_client_id',
  clientSecret: 'your_google_client_secret',
  callbackURL: 'http://localhost:3000/auth/google/callback' // Change the URL based on your setup
}, (accessToken, refreshToken, profile, done) => {
  // You can customize the user creation logic or store user data in the database here
  return done(null, profile);
}));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware to initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Express session middleware
app.use(require('express-session')({
  secret: 'your_session_secret', // Replace with your actual session secret
  resave: true,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Google login route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

// Google callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or home page
    res.redirect('/dashboard');
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.displayName}!`);
  } else {
    res.redirect('/');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
