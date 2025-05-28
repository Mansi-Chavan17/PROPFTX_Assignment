import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ name: "", genre: "", rating: "", language: "", image: "" });
  const [file, setFile] = useState(null);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", genre: "", rating: "", language: "", image: "" });
  const [editFile, setEditFile] = useState(null);

  const fetchMovies = async () => {
    const res = await API.get("/movie/get-movie");
    setMovies(res.data.movie);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const uploadImage = async (imageFile) => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Upload failed: ${err}`);
      }

      const data = await res.json();
      if (data.success === 1) return data.image_url;
      return "";
    } catch (error) {
      console.error("Image upload failed", error);
      return "";
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage(file);
      }

      await API.post("/movie/add-movie", { ...form, image: imageUrl });

      setForm({ name: "", genre: "", rating: "", language: "", image: "" });
      setFile(null);
      fetchMovies();
    } catch {
      alert("Error adding movie");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/movie/delete-movie/${id}`);
      fetchMovies();
    } catch {
      alert("Error deleting movie");
    }
  };

  const startEdit = (movie) => {
    setEditingMovieId(movie._id);
    setEditForm({
      name: movie.name,
      genre: movie.genre,
      rating: movie.rating,
      language: movie.language,
      image: movie.image || "",
    });
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingMovieId(null);
    setEditFile(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editForm.image;
      if (editFile) {
        imageUrl = await uploadImage(editFile);
      }

      await API.put(`/movie/update-movie/${editingMovieId}`, { ...editForm, image: imageUrl });

      setEditingMovieId(null);
      setEditFile(null);
      fetchMovies();
    } catch {
      alert("Error updating movie");
    }
  };

  return (
    <div>
      <h2>Movies</h2>

      <form onSubmit={handleAdd}>
        <input placeholder="Movie Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
        <input type="number" placeholder="Rating (1-10)" min="1" max="10" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} required />
        <input placeholder="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} required />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Add Movie</button>
      </form>

      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            {editingMovieId === movie._id ? (
              <form onSubmit={handleEditSubmit}>
                <input placeholder="Movie Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                <input placeholder="Genre" value={editForm.genre} onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })} required />
                <input type="number" placeholder="Rating (1-10)" min="1" max="10" step="0.1" value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} required />
                <input placeholder="Language" value={editForm.language} onChange={(e) => setEditForm({ ...editForm, language: e.target.value })} required />
                <input type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0])} />
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
              </form>
            ) : (
              <>
                <h3 className="movie-title">{movie.name}</h3>
                <div className="movie-rating">⭐ {movie.rating}/10</div>
                {movie.image && <img src={movie.image} alt={movie.name} />}
                <div><strong>Genre:</strong> {movie.genre}</div>
                <div><strong>Language:</strong> {movie.language}</div>
                <div className="movie-actions">
                  <button onClick={() => startEdit(movie)}>Edit</button>
                  <button onClick={() => handleDelete(movie._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
