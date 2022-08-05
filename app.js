require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const { createUser, login, logout } = require('./controllers/users');
const { handleError } = require('./errors/handleError');
const { handleCelebrateError } = require('./errors/handleCelebrateError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginValidation, createUserValidation } = require('./middlewares/validate');

const { PORT = 3000, MONGO_SERV, NODE_ENV } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? MONGO_SERV : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);
app.get('/signout', logout);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use(errorLogger);
app.use(handleCelebrateError);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
