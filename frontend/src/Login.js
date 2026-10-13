import axios from "axios";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Login.css";

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
      const res = await axios.post("https://mern-movie-project.onrender.com/api/auth/login", {
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
    <div className="login-page">
      <div className="login-glow" />
      <div ref={cardRef} className="login-card">
        <div ref={titleRef} className="login-header">
          <span className="login-icon">🎬</span>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-sub">Sign in to your CineVault account</p>
        </div>

        <div ref={formRef} className="login-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              className="login-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => gsap.to(e.target, { borderColor: "var(--accent)", duration: 0.2 })}
              onBlur={(e) => gsap.to(e.target, { borderColor: "rgba(255,255,255,0.1)", duration: 0.2 })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="login-input"
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
            className="login-btn"
            style={{ opacity: loading ? 0.7 : 1 }}
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

export default Login;
