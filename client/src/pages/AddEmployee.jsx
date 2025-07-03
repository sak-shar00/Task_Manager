import { useState, useEffect } from "react";
import axios from "axios";

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    managerId: "",
  });
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // Fetch all managers to assign employee under
    const fetchManagers = async () => {
      const res = await axios.get("http://localhost:5000/api/admin/users/manager");
      setManagers(res.data);
    };
    fetchManagers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: "employee",
      });
      alert("✅ Employee added successfully!");
      setForm({ name: "", email: "", password: "", specialization: "", managerId: "" });
    } catch (err) {
      alert("❌ Failed to add employee");
      console.log(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow mt-8 rounded">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <select
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">-- Select Specialization --</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Designer">Designer</option>
          <option value="Uiux">UI/UX</option>
          <option value="Devops">DevOps</option>
        </select>

        <select
          name="managerId"
          value={form.managerId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Assign Manager</option>
          {managers.map((mgr) => (
            <option key={mgr._id} value={mgr._id}>
              {mgr.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
