const Movie = require('../models/movie');

module.exports.getMyMovies = (req, res) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    });
};

module.exports.createMovie = (req, res) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => {
      res.status(201).send(movie);
    });
};
