require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const { createUser, login, logout } = require('./controllers/users');
const { handleError } = require('./errors/handleError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.post('/signup', createUser);
app.post('/signin', login);
app.get('/signout', logout);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
