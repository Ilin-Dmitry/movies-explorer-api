const router = require('express').Router();
const { getMyMovies, createMovie } = require('../controllers/movies');

router.get('/movies', getMyMovies);
router.post('/movies', createMovie);
