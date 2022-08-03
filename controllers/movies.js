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
  // console.log('req.params.id =>', req.params.id);
  // console.log('req.user._id =>', req.user);
  // console.log('req.owner => ', req.owner);
  Movie.findById(req.params.id)
    .then((movie) => {
      console.log('movie from deleteMovie =>', movie);
      console.log('req.user._id =>', req.user._id);
      console.log('movie.owner =>', movie.owner.toString());
      if (!movie) {
        throw new NotFoundError('Такого фильма не найдено');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У вас недостаточно прав');
      } Movie.findByIdAndRemove(movie.id)
          .then(res.send({ message: 'Фильм успешно удален'}));
    })
    .catch(next);
};
