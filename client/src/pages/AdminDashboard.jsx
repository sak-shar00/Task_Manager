// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [specializations, setSpecializations] = useState({});
  const [viewRole, setViewRole] = useState("manager"); // or "employee"

 useEffect(() => {
  fetchUsers();
}, [viewRole]);

const fetchUsers = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/admin/users/${viewRole}`);
    setUsers(res.data);
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};


  const handleSpecializationChange = (id, value) => {
    setSpecializations({ ...specializations, [id]: value });
  };

  const updateSpecialization = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/employee/${id}/specialization`,
        { specialization: specializations[id] }
      );
      alert("Specialization updated!");
      fetchUsers();
    } catch (err) {
      alert("Update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/employee/${id}`);
      alert("User deleted!");
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredUsers = users.filter((u) => u.role === viewRole);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        Welcome Admin, {user?.name}
      </h1>

      {/* TOGGLE BUTTONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewRole("manager")}
          className={`px-4 py-2 rounded ${
            viewRole === "manager"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-indigo-600 text-indigo-600"
          }`}
        >
          View Managers
        </button>
        <button
          onClick={() => setViewRole("employee")}
          className={`px-4 py-2 rounded ${
            viewRole === "employee"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-indigo-600 text-indigo-600"
          }`}
        >
          View Employees
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
          {viewRole}s List
        </h2>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Specialization</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="e.g. frontend"
                    className="border rounded px-2 py-1"
                    value={specializations[user._id] || ""}
                    onChange={(e) =>
                      handleSpecializationChange(user._id, e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => updateSpecialization(user._id)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No {viewRole}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
