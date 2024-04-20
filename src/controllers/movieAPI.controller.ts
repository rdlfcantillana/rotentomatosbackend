import axios from 'axios';
import Movie, {IMovie} from '../models/movie';
import {Request, Response} from 'express'



const apiKey = '154759848d8b210d57070cde168eeef5';
const baseURL = 'https://api.themoviedb.org/3'

const searchMovies = '/search/movie'
const getMovies = '/movie/'
const getSeries = '/tv/'

// Get Movies from the API
async function fetchMovies(movieName: String) {

  const params = {
    api_key: apiKey,
    query: movieName
  }

  try{
    const response = await axios.get(baseURL + searchMovies, { params })
    return response.data['results'];
  }catch(error){
    console.error('Error making TMDb API Request: ', error)
  }
}

// Get a Movie from the API by its API Id
async function fetchMovieById(movieId: Number) {
  const params = {
    api_key: apiKey
  }

  try{
    const response = await axios.get(baseURL + getMovies + movieId, { params })
    console.log(response.data);
    return response.data;
  }catch(error){
    console.error('Error making TMDb API Request: ', error)
  }
}

async function fetchSeriesById(seriesId: Number) {
  const params = {
    api_key: apiKey
  }

  try{
    const response = await axios.get(baseURL + getSeries + seriesId, { params })
    return response.data;
  }catch(error){
    console.error('Error making TMDb API Request: ', error)
  }
}

// Get Movies function for the routes
export const getMovieListFromAPI = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.movieName){
    return res.status(400).json({msg:"Please. Provide with a movie name"})
  }
  const result = await fetchMovies(req.body.movieName)
  return res.status(200).json( result );
}

// API Tester for development use
export const apiTester = async (req: Request, res: Response): Promise<Response> =>{

  const seriesId = 40075;

  const result =  await fetchSeriesById(seriesId);
  return res.status(200).json( result );
}

// ADD MOVIE BY ID
export const addMovie = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.movieId){
    return res.status(400).json({msg: 'Please. Provide with a movie Id (movieId)'});
  }

  const existingMovie = await Movie.findOne({apiId:req.body.movieId})
  if(existingMovie){
    return res.status(400).json({msg: "The movie is already in the database"});
  }

  const result = await fetchMovieById(req.body.movieId);

  var rating = "PG";

  if (result["adult"]){
    rating = "R"
  }

  var durationInt = result["runtime"];
  const durationHours = Math.floor(durationInt / 60)
  const durationMinutes = durationInt - durationHours * 60;
  
  const durationString = `${durationHours}:${durationMinutes}:00`;

  const params = {
    title: result["original_title"],
    genre: result["genres"][0]["name"],
    posterImage: result["poster_path"],
    description: result["overview"],
    rating: rating,
    originalLanguage: result["original_language"],
    releaseDate: result["release_date"],
    duration: durationString,
    apiId: result["id"]
  }

  const newMovie = new Movie(params);
  await newMovie.save();

  return res.status(201).json(newMovie);
}

// ADD SERIES BY ID
export const addSeries = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.seriesId){
    return res.status(400).json({msg: 'Please. Provide with a series Id (seriesId)'});
  }

  const existingSeries = await Movie.findOne({apiId:req.body.seriesId})
  if(existingSeries){
    return res.status(400).json({msg: "The series is already in the database"});
  }

  const result = await fetchSeriesById(req.body.seriesId);
  console.log(result);

  var rating = "PG";

  if (result["adult"]){
    rating = "R"
  }

  const params = {
    title: result["original_name"],
    genre: result["genres"][0]["name"],
    posterImage: result["poster_path"],
    description: result["overview"],
    rating: rating,
    originalLanguage: result["original_language"],
    releaseDate: result["first_air_date"],
    duration: result["episode_run_time"][0],
    isMovie: false,
    apiId: result["id"]
  }

  const newMovie = new Movie(params);
  await newMovie.save();

  return res.status(201).json(newMovie);
}