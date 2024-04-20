"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const movieAPI_controller_1 = require("../controllers/movieAPI.controller");
const user_controller_1 = require("../controllers/user.controller");
const movie_controller_1 = require("../controllers/movie.controller");
// MOVIE ROUTES
// - CREATE ROUTES
router.post('/newCritic', user_controller_1.newCritic);
router.post('/addMovie', movieAPI_controller_1.addMovie);
router.post('/addSeries', movieAPI_controller_1.addSeries);
// - MODIFY ROUTES
router.put('/addTrailer', movie_controller_1.addTrailer);
// - DELETE ROUTES
// - GET ROUTES
router.post('/getMoviesFromApi', movieAPI_controller_1.getMovieListFromAPI);
exports.default = router;
