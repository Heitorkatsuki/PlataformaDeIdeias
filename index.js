require('dotenv').config();
require('express-async-errors');

const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const helmet = require('helmet');
const csurf = require('csurf');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const voteRoutes = require('./routes/voteRoutes');
const globalErrorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- DB -----
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => console.log('🔌 MongoDB conectado'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

// ----- view engine -----
const hbs = exphbs.create({
  extname: ".handlebars",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
  helpers: {
    ifEquals(a, b, opts) {
      if (a === undefined || a === null || b === undefined || b === null) {
        return a === b ? opts.fn(this) : opts.inverse(this);
      }
      return a.toString() === b.toString() ? opts.fn(this) : opts.inverse(this);
    },
  },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ----- static & parsers -----
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ----- security -----
app.use(helmet());

// ----- session -----
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  ttl: 14 * 24 * 60 * 60, // 14 days
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

// ----- flash -----
app.use(flash());

// ----- CSRF -----
app.use(csurf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = req.flash();
  next();
});

// ----- routes -----
app.use('/', authRoutes);
app.use('/ideas', ideaRoutes);
app.use('/votes', voteRoutes);
app.get('/', (req, res) => res.redirect('/ideas'));

// ----- error handler -----
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
