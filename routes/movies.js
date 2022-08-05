const router = require('express').Router();
const { getMyMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation } = require('../middlewares/validate');

router.get('/movies', getMyMovies);
router.post('/movies', createMovieValidation, createMovie);
router.delete('/movies/:id', deleteMovie);
module.exports = router;
