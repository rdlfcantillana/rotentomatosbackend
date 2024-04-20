"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
const movie_controller_1 = require("../controllers/movie.controller");
const comment_controller_1 = require("../controllers/comment.controller");
// USER ROUTES
// - DELETE ROUTE
router.delete('/deleteuser', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.deleteUser);
// - MODIFY ROUTES
router.put('/modifyuser', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.modifyUser);
router.put('/modifyuserpassword', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.modifyUserPassword);
router.put('/changePicture', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.changePicture);
router.put('/movieRating', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.movieRating);
// - GET ROUTES
router.post('/checkusername', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.checkUsername);
router.post('/getuserdata', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.getUserData);
router.post('/getFeed', passport_1.default.authenticate('jwt', { session: false }), movie_controller_1.getFeed);
router.post('/getMovie', passport_1.default.authenticate('jwt', { session: false }), movie_controller_1.getMovie);
router.post('/getMovieComments', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.getMovieComments);
router.post('/getResponseComment', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.getResponseComment);
router.post('/fuzzySearchUsers', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.fuzzySearchUsers);
router.post('/fuzzySearchMovies', passport_1.default.authenticate('jwt', { session: false }), movie_controller_1.fuzzySearchMovies);
// - CREATE ROUTES
router.post('/commentMovie', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.commentMovie);
router.post('/responseComment', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.responseComment);
exports.default = router;
