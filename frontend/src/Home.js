import axios from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Home.css";

const API = "https://mern-movie-backend-production.up.railway.app/api";

function MovieCard({ movie, isAdmin, deleteMovie }) {
  const cardRef = useRef(null);

  const onEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.03,
      boxShadow: "0 24px 60px rgba(229,9,20,0.25)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      duration: 0.35,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className="movie-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="card-image-wrap">
        <img
          src={movie.img || "https://via.placeholder.com/300x420/13132a/8888aa?text=No+Image"}
          alt={movie.title}
          className="card-image"
        />
        <div className="card-overlay" />
        {movie.rating && (
          <div className="rating-badge">
            <span className="rating-star">★</span>
            <span className="rating-value">{movie.rating}</span>
          </div>
        )}
        {isAdmin && (
          <button className="delete-btn" onClick={() => deleteMovie(movie._id)}>
            ✕
          </button>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>
        <p className="card-desc">{movie.description}</p>
        <div className="card-meta">
          {movie.duration && <span className="meta-chip">{movie.duration} min</span>}
          {movie.releaseDate && (
            <span className="meta-chip">{String(movie.releaseDate).slice(0, 4)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const isAdmin = localStorage.getItem("role") === "admin";

  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const controlsRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(heroTitleRef.current, { y: 60, opacity: 0, duration: 1, ease: "power4.out" })
        .from(heroSubRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(controlsRef.current, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    gsap.fromTo(
      ".movie-card",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "back.out(1.3)" }
    );
  }, [movies]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${API}/movies`);
      setMovies(res.data);
    } catch (err) {
      console.error("Failed to fetch movies:", err.message);
    }
  };

  const searchMovies = async (text) => {
    if (!text) { fetchMovies(); return; }
    try {
      const res = await axios.get(`${API}/movies/search?q=${text}`);
      setMovies(res.data);
    } catch (err) {
      console.error("Search failed:", err.message);
    }
  };

  const sortMovies = async (type) => {
    if (!type) return;
    try {
      const res = await axios.get(`${API}/movies/sorted?by=${type}`);
      setMovies(res.data);
    } catch (err) {
      console.error("Sort failed:", err.message);
    }
  };

  const addMovie = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(
        `${API}/movies`,
        { title, description, rating, releaseDate, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMovies();
      setTitle(""); setDescription(""); setRating(""); setReleaseDate(""); setDuration("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Add movie failed:", err.message);
    }
  };

  const deleteMovie = (id) => {
    gsap.to(`[data-id="${id}"]`, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: async () => {
        try {
          await axios.delete(`${API}/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchMovies();
        } catch (err) {
          console.error("Delete failed:", err.message);
        }
      },
    });
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <div className="hero">
        <div className="hero-glow" />
        <h1 ref={heroTitleRef} className="hero-title">
          Discover <span className="hero-accent">Great Films</span>
        </h1>
        <p ref={heroSubRef} className="hero-sub">
          Browse, search, and explore your movie collection
        </p>
      </div>

      {/* CONTROLS */}
      <div ref={controlsRef} className="controls">
        <div
          className="search-wrap"
          onFocus={(e) => gsap.to(e.currentTarget, { boxShadow: "0 0 0 2px var(--accent)", duration: 0.2 })}
          onBlur={(e) => gsap.to(e.currentTarget, { boxShadow: "none", duration: 0.2 })}
        >
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            className="search-input"
            onChange={(e) => { setQuery(e.target.value); searchMovies(e.target.value); }}
          />
        </div>

        <select className="sort-select" onChange={(e) => sortMovies(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="releaseDate">Release Date</option>
          <option value="duration">Duration</option>
        </select>

        {isAdmin && (
          <button className="add-btn" onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? "✕ Cancel" : "+ Add Movie"}
          </button>
        )}
      </div>

      {/* ADD MOVIE FORM */}
      {isAdmin && showAddForm && (
        <div className="add-form">
          <h3 className="add-form-title">Add New Movie</h3>
          <div className="form-grid">
            <input className="form-input" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="form-input" placeholder="Rating (e.g. 8.5)" value={rating} onChange={(e) => setRating(e.target.value)} />
            <input className="form-input" placeholder="Release Date (YYYY-MM-DD)" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            <input className="form-input" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <input className="form-input form-input-full" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button className="submit-btn" onClick={addMovie}>Add Movie</button>
        </div>
      )}

      {/* RESULTS COUNT */}
      <div className="results-bar">
        <span className="results-text">{movies.length} movie{movies.length !== 1 ? "s" : ""}</span>
      </div>

      {/* GRID */}
      <div ref={gridRef} className="movies-grid">
        {movies.map((movie, i) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            isAdmin={isAdmin}
            deleteMovie={deleteMovie}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
