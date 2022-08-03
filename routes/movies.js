const router = require('express').Router();
const { getMyMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMyMovies);
router.post('/movies', createMovie);
router.delete('/movies/:id', deleteMovie);
module.exports = router;
