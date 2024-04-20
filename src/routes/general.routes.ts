
import {Router} from 'express';
const router = Router();

import { changePicture, checkUsername, deleteUser, fuzzySearchUsers, getUserData, modifyUser, modifyUserPassword, movieRating, testerController } from '../controllers/user.controller';
import passport from 'passport';
import { fuzzySearchMovies, getFeed, getMovie } from '../controllers/movie.controller';
import { responseComment, commentMovie, getResponseComment, getMovieComments } from '../controllers/comment.controller';


// USER ROUTES
// - DELETE ROUTE
router.delete('/deleteuser', passport.authenticate('jwt', {session: false}), deleteUser);

// - MODIFY ROUTES
router.put('/modifyuser', passport.authenticate('jwt', {session: false}), modifyUser);
router.put('/modifyuserpassword', passport.authenticate('jwt', {session: false}), modifyUserPassword);
router.put('/changePicture', passport.authenticate('jwt', {session: false}), changePicture);
router.put('/movieRating', passport.authenticate('jwt', {session: false}), movieRating);

// - GET ROUTES
router.post('/checkusername', passport.authenticate('jwt', {session: false}), checkUsername);
router.post('/getuserdata', passport.authenticate('jwt', {session: false}), getUserData);
router.post('/getFeed', passport.authenticate('jwt', {session: false}), getFeed);
router.post('/getMovie', passport.authenticate('jwt', {session: false}), getMovie);
router.post('/getMovieComments', passport.authenticate('jwt', {session: false}), getMovieComments);
router.post('/getResponseComment', passport.authenticate('jwt', {session: false}), getResponseComment);
router.post('/fuzzySearchUsers', passport.authenticate('jwt', {session: false}), fuzzySearchUsers);
router.post('/fuzzySearchMovies', passport.authenticate('jwt', {session: false}), fuzzySearchMovies);

// - CREATE ROUTES
router.post('/commentMovie', passport.authenticate('jwt', {session: false}), commentMovie);
router.post('/responseComment', passport.authenticate('jwt', {session: false}), responseComment);



export default router;