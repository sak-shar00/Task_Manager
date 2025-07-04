import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-100 to-purple-100">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to Task Manager </h1>
      <p className="text-lg text-gray-700 mb-6">Please login or register to get started.</p>
      {!user ? (
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      ) : (
        <button
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => navigate(`/${user.role}`)}
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
};

export default Home;
