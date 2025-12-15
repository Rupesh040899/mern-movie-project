import { useEffect } from "react";

function Admin() {
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied");
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* your admin add/edit/delete UI */}
    </div>
  );
}

export default Admin;
