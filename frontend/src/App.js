import { useLayoutEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import gsap from "gsap";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";
import "./App.css";

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
    <nav ref={navRef} className="navbar">
      <div ref={logoRef} className="nav-logo">
        <span className="nav-logo-icon">🎬</span>
        <Link to="/" className="nav-logo-text">CineVault</Link>
      </div>
      <div ref={linksRef} className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {!token && <Link to="/login" className="nav-link-accent">Login</Link>}
        {token && role === "admin" && <Link to="/admin" className="nav-link">Admin</Link>}
        {token && (
          <button onClick={logout} className="logout-btn">Logout</button>
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

export default App;
