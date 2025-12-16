import axios from "axios";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

// Movie Card Component
function ActionAreaCard({ movie, isAdmin, deleteMovie }) {
  return (
    <Card sx={{ maxWidth: 300, minWidth: 300 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={movie.img || "https://via.placeholder.com/300x140"}
          alt={movie.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {movie.title}
          </Typography>

          <Typography variant="body2">
            {movie.description}
          </Typography>

          <Typography variant="body2">
            ⭐ {movie.rating}
          </Typography>

          {isAdmin && (
            <button
              style={{
                marginTop: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
              }}
              onClick={() => deleteMovie(movie._id)}
            >
              Delete
            </button>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");

  // Admin form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");

  const isAdmin = localStorage.getItem("role") === "admin";
  const token = localStorage.getItem("token");

  // Fetch movies
  const fetchMovies = async () => {
    const res = await axios.get("https://mern-movie-backend-production.up.railway.app/api/movies");
    setMovies(res.data);
  };

  // Search
  const searchMovies = async (text) => {
    if (!text) {
      fetchMovies();
      return;
    }
    const res = await axios.get(
      `https://mern-movie-backend-production.up.railway.app/api/movies/search?q=${text}`
    );
    setMovies(res.data);
  };

  // Sort
  const sortMovies = async (type) => {
    if (!type) return;
    const res = await axios.get(
      `https://mern-movie-backend-production.up.railway.app/api/movies/sorted?by=${type}`
    );
    setMovies(res.data);
  };

  // Add movie (Admin)
  const addMovie = async () => {
    await axios.post(
      "https://mern-movie-backend-production.up.railway.app/api/movies",
      { title, description, rating, releaseDate, duration },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchMovies();
  };

  // Delete movie (Admin)
  const deleteMovie = async (id) => {
    await axios.delete(`https://mern-movie-backend-production.up.railway.app/api/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movies</h1>

      {/* ADMIN ADD MOVIE */}
      {isAdmin && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Add Movie (Admin)</h3>
          <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
          <input placeholder="Description" onChange={e => setDescription(e.target.value)} />
          <input placeholder="Rating" onChange={e => setRating(e.target.value)} />
          <input placeholder="Release Date" onChange={e => setReleaseDate(e.target.value)} />
          <input placeholder="Duration" onChange={e => setDuration(e.target.value)} />
          <button onClick={addMovie}>Add Movie</button>
        </div>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name or description"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchMovies(e.target.value);
        }}
      />

      {/* SORT */}
      <select onChange={(e) => sortMovies(e.target.value)}>
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="rating">Rating</option>
        <option value="releaseDate">Release Date</option>
        <option value="duration">Duration</option>
      </select>

      <hr />

      {/* MOVIE GRID */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        {movies.map((movie) => (
          <ActionAreaCard
            key={movie._id}
            movie={movie}
            isAdmin={isAdmin}
            deleteMovie={deleteMovie}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
