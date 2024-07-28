const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const bodyParser = require('body-parser');


//models:
const User = require('./models/user');
const Company = require('./models/company');
const Interview = require('./models/interviews');
const Interviewer = require('./models/interviewer');


app.use(bodyParser.urlencoded({ extended: false }))


//session settings:
const sessionConfig = {
    secret: "gnb",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
//passport settings:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//connecting to mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Hirely')
    .then(() => {
        console.log("Connected");
    })
    .catch((e) => {
        console.log(e);
    })

//views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))

//static
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})


app.get('/', (req,res) => {
    res.render('home');
})

app.get('/login', (req,res) => {
    res.render('login');
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));


app.get('/signup', (req,res) => {
    res.render('signup');
})
app.post('/signup', async (req,res) => {
    const { role, username, email, password } = req.body;

  const newUser = new User({ username, email, role });
  await User.register(newUser, password);

  if (role === 'interviewer') {
    const { firstName, lastName, description, profilePicture, company ,resume, active } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newInterviewer = new Interviewer({
      username,
      firstName,
      lastName,
      email,
      description,
      password: hashedPassword,
      profilePicture,
      resume,
      company,
      active: !!active,
    });
    await newInterviewer.save();
  } else if (role === 'company') {
    const { companyName, description, logo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({
      companyName,
      username,
      email,
      password: hashedPassword,
      description,
      logo,
    });
    await newCompany.save();
  }

  res.redirect('/login');
})


app.get('/logout', (req,res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

app.get('/dashboard', (req,res) => {
    if (req.user && req.user.role && req.user.role === 'interviewer') {
        return res.render('dashboardInterviewer');
    }
    res.render('dashboardCompany');
})

app.get('/newInterview', (req,res) => {
    res.render('newInterview');
})

app.listen(8000, ()=> {
    console.log('Listening');
})