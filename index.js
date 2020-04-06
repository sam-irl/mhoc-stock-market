const express = require('express');
const session = require('express-session');
const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const path = require('path');
const mongoose = require('mongoose');

const app = express();

const {
    MONGOOSE_CONNECT_URI,
    APP_DEPLOYMENT_URL,
    APP_DEPLOYMENT_PORT,
    REDDIT_CONSUMER_KEY,
    REDDIT_CONSUMER_SECRET
} = require('./config.json');
const SESSION_SECRET = process.env.SESSION_SECRET || 'insecure secret';
const url = APP_DEPLOYMENT_URL || 'http://localhost';
const port = APP_DEPLOYMENT_PORT || 3000;

mongoose.connect(MONGOOSE_CONNECT_URI, { useNewUrlParser: true });

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new RedditStrategy({
    clientID: REDDIT_CONSUMER_KEY,
    clientSecret: REDDIT_CONSUMER_SECRET,
    callbackURL: url + "/auth/reddit/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const routes = {
    root: require('./routes/root')
};

app.use('/', routes.root);

app.listen(port, () => console.log(`started mhoc-stock-market on port ${port}`));