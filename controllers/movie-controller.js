import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin";
import Movie from "../models/Movie";
export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // verify token
  try {
    const decrypted = await jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }


  //create new movie
  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;
  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !posterUrl ||
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
    });

    // Save the movie
    await movie.save();

    // Update the adminUser's addedMovies array
    const adminUser = await Admin.findById(adminId);
    adminUser.addedMovies.push(movie);
    await adminUser.save();
  } catch (err) {
    return console.log(err.message);
  }


  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};
