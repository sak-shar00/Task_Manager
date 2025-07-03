import { useState } from "react";
import axios from "axios";

const AddManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-manager", formData);
      alert("✅ Manager added successfully");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error adding manager");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Add New Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Manager Name"
          className="w-full border px-3 py-2 rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Manager Email"
          className="w-full border px-3 py-2 rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Add Manager
        </button>
      </form>
    </div>
  );
};

export default AddManager;
