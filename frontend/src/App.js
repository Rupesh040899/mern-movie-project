import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Router>
      {/* 🔝 NAVBAR */}
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Home
        </Link>

        {!token && (
          <Link to="/login" style={{ marginRight: "10px" }}>
            Login
          </Link>
        )}

        {token && role === "admin" && (
          <Link to="/admin" style={{ marginRight: "10px" }}>
            Admin
          </Link>
        )}

        {token && (
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        )}
      </nav>

      {/* 📄 ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
