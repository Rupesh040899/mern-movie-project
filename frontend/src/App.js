import { useLayoutEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import gsap from "gsap";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";

function Navbar() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(navRef.current, { y: -80, opacity: 0, duration: 0.7, ease: "power3.out" })
        .from(logoRef.current, { x: -30, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .from(linksRef.current.children, { x: 20, opacity: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} style={styles.nav}>
      <div ref={logoRef} style={styles.logo}>
        <span style={styles.logoIcon}>🎬</span>
        <Link to="/" style={styles.logoText}>CineVault</Link>
      </div>
      <div ref={linksRef} style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Home</Link>
        {!token && <Link to="/login" style={styles.navLinkAccent}>Login</Link>}
        {token && role === "admin" && <Link to="/admin" style={styles.navLink}>Admin</Link>}
        {token && (
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: "64px",
    background: "var(--nav-bg)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "24px",
  },
  logoText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "26px",
    letterSpacing: "3px",
    color: "var(--text)",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  navLink: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-muted)",
    textDecoration: "none",
    transition: "color 0.2s",
    letterSpacing: "0.5px",
  },
  navLinkAccent: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--accent)",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "var(--text-muted)",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default App;
