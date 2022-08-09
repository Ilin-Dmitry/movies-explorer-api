require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const { handleError } = require('./errors/handleError');
const { handleCelebrateError } = require('./errors/handleCelebrateError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_SERV, NODE_ENV } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(NODE_ENV === 'production' ? MONGO_SERV : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(handleCelebrateError);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
