import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // ✅ Get token from logged-in admin
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    if (!token) {
      alert("Unauthorized. Admin login required.");
      return;
    }

    // ✅ Pass token in Authorization header
    await axios.post("http://localhost:5000/api/auth/register", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(formData);
    alert("User registered successfully ✔");
    navigate("/login");
  } catch (err) {
    const msg =
      err.response?.data?.message || "Registration failed. Try again.";
    alert(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            className="cursor-pointer font-medium text-indigo-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
