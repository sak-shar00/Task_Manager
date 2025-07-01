import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">
          TaskManager
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:text-indigo-200">Login</Link>
          <Link to="/register" className="hover:text-indigo-200">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
