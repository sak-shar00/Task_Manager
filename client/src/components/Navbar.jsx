import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">TaskManager</Link>
        <div className="space-x-4">

          {!user && (
            <>
              <Link to="/login" className="hover:text-indigo-200">Login</Link>
              <Link to="/register" className="hover:text-indigo-200">Register</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-indigo-200">Dashboard</Link>
              <Link to="/register" className="hover:text-indigo-200">Add User</Link>
              <button onClick={logout} className="hover:text-indigo-200">Logout</button>
            </>
          )}

          {user?.role === "manager" && (
            <>
              <Link to="/manager" className="hover:text-indigo-200">Dashboard</Link>
                     <Link to="/manager/create-task" className="hover:text-indigo-200">Create Task</Link>
              <button onClick={logout} className="hover:text-indigo-200">Logout</button>
            </>
          )}

          {user?.role === "employee" && (
            <>
              <Link to="/employee" className="hover:text-indigo-200">My Tasks</Link>
              <button onClick={logout} className="hover:text-indigo-200">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
