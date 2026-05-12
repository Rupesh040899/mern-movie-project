import axios from "axios";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(cardRef.current, { y: 60, opacity: 0, duration: 0.7, ease: "power3.out" })
        .from(titleRef.current, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .from(formRef.current.children, { y: 16, opacity: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }, "-=0.2");
    });
    return () => ctx.revert();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://mern-movie-backend-production.up.railway.app/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      window.location.href = "/";
    } catch (err) {
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)", clearProps: "x" });
      gsap.fromTo(cardRef.current, { borderColor: "var(--accent)" }, { borderColor: "rgba(255,255,255,0.07)", duration: 0.8 });
      alert("Login failed: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div ref={cardRef} style={styles.card}>
        <div ref={titleRef} style={styles.header}>
          <span style={styles.icon}>🎬</span>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.sub}>Sign in to your CineVault account</p>
        </div>

        <div ref={formRef} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => gsap.to(e.target, { borderColor: "var(--accent)", duration: 0.2 })}
              onBlur={(e) => gsap.to(e.target, { borderColor: "rgba(255,255,255,0.1)", duration: 0.2 })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => gsap.to(e.target, { borderColor: "var(--accent)", duration: 0.2 })}
              onBlur={(e) => gsap.to(e.target, { borderColor: "rgba(255,255,255,0.1)", duration: 0.2 })}
            />
          </div>

          <button
            style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
            onClick={login}
            disabled={loading}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
    background: "var(--bg)",
  },
  glow: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "400px",
    background: "radial-gradient(ellipse, rgba(229,9,20,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "var(--card-bg)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "44px 40px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "36px",
  },
  icon: {
    fontSize: "36px",
    display: "block",
    marginBottom: "12px",
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "32px",
    letterSpacing: "2px",
    marginBottom: "8px",
  },
  sub: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-muted)",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },
  input: {
    background: "var(--bg2)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  loginBtn: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    marginTop: "4px",
    cursor: "pointer",
  },
};

export default Login;
