import { useEffect, useState } from "react";
import axios from "axios";

const SubtaskList = ({ taskId }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    assignedTo: "",
  });
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSubtasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/subtasks/task/${taskId}`);
    setSubtasks(res.data);
  };

  useEffect(() => {
    fetchSubtasks();
    // Fetch employees under same manager (optional logic)
    const fetchEmployees = async () => {
      const res = await axios.get("http://localhost:5000/api/users/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(res.data);
    };
    fetchEmployees();
  }, [taskId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newSubtask = {
      ...formData,
      taskId,
      assignedBy: user._id,
    };
    await axios.post("http://localhost:5000/api/subtasks", newSubtask);
    setFormData({ title: "", assignedTo: "" });
    setShowForm(false);
    fetchSubtasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/subtasks/${id}/status`, { status });
    fetchSubtasks();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">🧩 Subtasks</h3>

      {subtasks.length === 0 && <p className="text-sm text-gray-500">No subtasks yet.</p>}

      {subtasks.map((st) => (
        <div key={st._id} className="bg-gray-100 p-3 rounded mb-2 flex justify-between items-center">
          <div>
            <p className="font-medium">{st.title}</p>
            <p className="text-sm text-gray-600">
              Assigned To: {st.assignedTo?.name || "N/A"} | Status: {st.status}
            </p>
          </div>

          <select
            value={st.status}
            onChange={(e) => updateStatus(st._id, e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ))}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-4 text-indigo-600 underline text-sm"
      >
        {showForm ? "Cancel" : "Add Subtask"}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-2">
          <input
            type="text"
            name="title"
            placeholder="Subtask Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">-- Assign to --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Subtask
          </button>
        </form>
      )}
    </div>
  );
};

export default SubtaskList;
