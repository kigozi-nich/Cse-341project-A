require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy; 

const mongodb = require('./data/database');
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in Express body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
// This is the basic express session({..}) initialization.
// app.use(passport.initialize());
// app.use(passport.session());
// init passport on every route call.
app.use(passport.initialize());
// allow passport to use "express-session".
app.use(passport.session());

// CORS middleware  
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(cors({ methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}));
app.use(cors({ origin: '*'}));

// GitHub OAuth Strategy Configuration
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.CALLBACK_URL) {
    console.error('Missing required environment variables: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, or CALLBACK_URL');
    console.log('Current env vars:', {
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'SET' : 'MISSING',
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'SET' : 'MISSING',
        CALLBACK_URL: process.env.CALLBACK_URL ? 'SET' : 'MISSING'
    });
}

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return done(null, profile);
    // });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication Routes
app.get('/', (req, res) => { 
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.use("/", require("./routes/index.js"));




mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {console.log(`Database is listening and node is running on port ${PORT}`);});
    }
});

