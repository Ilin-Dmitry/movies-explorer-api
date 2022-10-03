require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes/index');
const limiter = require('./middlewares/limiter');
const { handleError } = require('./errors/handleError');
const { handleCelebrateError } = require('./errors/handleCelebrateError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleCors = require('./middlewares/handleCors');

const { PORT = 3001, MONGO_SERV, NODE_ENV } = process.env;
const app = express();
app.use(handleCors);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(NODE_ENV === 'production' ? MONGO_SERV : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(handleCelebrateError);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
