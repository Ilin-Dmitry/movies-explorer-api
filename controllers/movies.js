const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
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
    trailerLink,
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
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(201).send(movie);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      // console.log('movie.owner =>', movie.owner);
      // console.log('movie.owner.toString() =>', movie.owner.toString());
      console.log('movie =>', movie);
      if (!movie) {
        throw new NotFoundError('Такого фильма не найдено');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У вас недостаточно прав');
      } Movie.findByIdAndRemove(movie.id)
        .then(res.send({ message: 'Фильм успешно удален' }));
    })
    .catch(next);
};
