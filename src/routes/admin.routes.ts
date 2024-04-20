import {Router} from 'express';
const router = Router();
import { addMovie, addSeries, apiTester, getMovieListFromAPI } from '../controllers/movieAPI.controller';
import { newCritic } from '../controllers/user.controller';
import { addTrailer } from '../controllers/movie.controller';

// MOVIE ROUTES
// - CREATE ROUTES
router.post('/newCritic', newCritic);
router.post('/addMovie', addMovie);
router.post('/addSeries', addSeries);

// - MODIFY ROUTES
router.put('/addTrailer',  addTrailer);

// - DELETE ROUTES

// - GET ROUTES
router.post('/getMoviesFromApi', getMovieListFromAPI);

export default router