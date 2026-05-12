import axios from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const API = "https://mern-movie-backend-production.up.railway.app/api";

function MovieCard({ movie, isAdmin, deleteMovie, index }) {
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
      style={styles.card}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div style={styles.cardImageWrap}>
        <img
          src={movie.img || "https://via.placeholder.com/300x420/13132a/8888aa?text=No+Image"}
          alt={movie.title}
          style={styles.cardImage}
        />
        <div style={styles.cardOverlay} />
        {movie.rating && (
          <div style={styles.ratingBadge}>
            <span style={{ color: "var(--gold)", fontSize: "12px" }}>★</span>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{movie.rating}</span>
          </div>
        )}
        {isAdmin && (
          <button
            style={styles.deleteBtn}
            onClick={() => deleteMovie(movie._id)}
          >
            ✕
          </button>
        )}
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{movie.title}</h3>
        <p style={styles.cardDesc}>{movie.description}</p>
        <div style={styles.cardMeta}>
          {movie.duration && <span style={styles.metaChip}>{movie.duration} min</span>}
          {movie.releaseDate && (
            <span style={styles.metaChip}>{String(movie.releaseDate).slice(0, 4)}</span>
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
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(heroTitleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(heroSubRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.5")
        .from(controlsRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    gsap.fromTo(
      ".movie-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "back.out(1.3)",
      }
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
    <div style={styles.page}>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <h1 ref={heroTitleRef} style={styles.heroTitle}>
          Discover <span style={styles.heroAccent}>Great Films</span>
        </h1>
        <p ref={heroSubRef} style={styles.heroSub}>
          Browse, search, and explore your movie collection
        </p>
      </div>

      {/* CONTROLS */}
      <div ref={controlsRef} style={styles.controls}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            style={styles.searchInput}
            onChange={(e) => {
              setQuery(e.target.value);
              searchMovies(e.target.value);
            }}
            onFocus={(e) => gsap.to(e.target.parentNode, { boxShadow: "0 0 0 2px var(--accent)", duration: 0.2 })}
            onBlur={(e) => gsap.to(e.target.parentNode, { boxShadow: "none", duration: 0.2 })}
          />
        </div>

        <select
          style={styles.sortSelect}
          onChange={(e) => sortMovies(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="releaseDate">Release Date</option>
          <option value="duration">Duration</option>
        </select>

        {isAdmin && (
          <button
            style={styles.addBtn}
            onClick={() => setShowAddForm((v) => !v)}
          >
            {showAddForm ? "✕ Cancel" : "+ Add Movie"}
          </button>
        )}
      </div>

      {/* ADD MOVIE FORM */}
      {isAdmin && showAddForm && (
        <div style={styles.addForm}>
          <h3 style={styles.addFormTitle}>Add New Movie</h3>
          <div style={styles.formGrid}>
            <input style={styles.formInput} placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input style={styles.formInput} placeholder="Rating (e.g. 8.5)" value={rating} onChange={(e) => setRating(e.target.value)} />
            <input style={styles.formInput} placeholder="Release Date (YYYY-MM-DD)" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            <input style={styles.formInput} placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <input style={{ ...styles.formInput, gridColumn: "1 / -1" }} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button style={styles.submitBtn} onClick={addMovie}>Add Movie</button>
        </div>
      )}

      {/* RESULTS COUNT */}
      <div style={styles.resultsBar}>
        <span style={styles.resultsText}>{movies.length} movie{movies.length !== 1 ? "s" : ""}</span>
      </div>

      {/* GRID */}
      <div ref={gridRef} style={styles.grid}>
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

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
  },
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "80px 20px 60px",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "300px",
    background: "radial-gradient(ellipse, rgba(229,9,20,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(48px, 8vw, 90px)",
    letterSpacing: "4px",
    lineHeight: 1,
    marginBottom: "16px",
    position: "relative",
  },
  heroAccent: {
    color: "var(--accent)",
  },
  heroSub: {
    fontSize: "16px",
    color: "var(--text-muted)",
    letterSpacing: "0.5px",
    position: "relative",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 40px 30px",
    flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1,
    minWidth: "220px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "10px",
    padding: "0 16px",
    height: "44px",
    transition: "box-shadow 0.2s",
  },
  searchIcon: {
    fontSize: "15px",
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
    fontSize: "14px",
  },
  sortSelect: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    color: "var(--text)",
    borderRadius: "10px",
    padding: "0 16px",
    height: "44px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  addBtn: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0 20px",
    height: "44px",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  addForm: {
    margin: "0 40px 30px",
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "var(--radius)",
    padding: "28px",
  },
  addFormTitle: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "20px",
    color: "var(--text)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  formInput: {
    background: "var(--bg2)",
    border: "1px solid var(--card-border)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
  },
  submitBtn: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 28px",
    fontSize: "14px",
    fontWeight: 600,
  },
  resultsBar: {
    padding: "0 40px 16px",
  },
  resultsText: {
    fontSize: "13px",
    color: "var(--text-muted)",
    letterSpacing: "0.3px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
    padding: "0 40px 60px",
  },
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    transition: "border-color 0.2s",
  },
  cardImageWrap: {
    position: "relative",
    overflow: "hidden",
    aspectRatio: "2/3",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(19,19,42,0.9) 0%, transparent 50%)",
  },
  ratingBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    borderRadius: "6px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#fff",
  },
  deleteBtn: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "var(--accent)",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    width: "28px",
    height: "28px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: "14px 16px 16px",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "6px",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardDesc: {
    fontSize: "12px",
    color: "var(--text-muted)",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "10px",
  },
  cardMeta: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  metaChip: {
    fontSize: "11px",
    background: "rgba(255,255,255,0.07)",
    borderRadius: "4px",
    padding: "2px 8px",
    color: "var(--text-muted)",
  },
};

export default Home;
