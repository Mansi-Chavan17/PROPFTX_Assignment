const express = require("express");
const movieModel = require("../models/movie.model");
const authMiddleware = require("../middlewares/auth.middleware");
const movieRouter = express.Router();

movieRouter.post("/add-movie", authMiddleware, async (req, res) => {
  try {
    const movie = await movieModel.create({ ...req.body, userId: req.user });
    res.status(200).json({ msg: "Movie added", movie });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

movieRouter.get("/get-movie", async (req, res) => {
  try {
    const movie = await movieModel.find();
    res.status(200).json({ msg: "List of movies", movie });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

movieRouter.delete("/delete-movie/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await movieModel.findOneAndDelete({ _id: id, userId: req.user });

    if (!deletedMovie) {
      return res.status(404).json({ msg: "Movie not found or unauthorized" });
    }

    res.status(200).json({ msg: "Movie deleted", deletedMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

movieRouter.put("/update-movie/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await movieModel.findOneAndUpdate(
      { _id: id, userId: req.user },
      { ...req.body },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ msg: "Movie not found or unauthorized" });
    }

    res.status(200).json({ msg: "Movie updated", updatedMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = movieRouter;
