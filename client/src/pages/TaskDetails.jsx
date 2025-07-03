import { useEffect, useState } from "react";
import axios from "axios";

const SubtaskList = ({ taskId }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState({
    title: "",
    assignedTo: "",
  });
  const [employees, setEmployees] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Fetch subtasks
  useEffect(() => {
    fetchSubtasks();
    fetchEmployees();
  }, []);

  const fetchSubtasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/subtasks/${taskId}`);
    setSubtasks(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/users?role=employee", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployees(res.data);
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.title || !newSubtask.assignedTo) return alert("Fill all fields");

    await axios.post(
      `http://localhost:5000/api/subtasks`,
      { ...newSubtask, taskId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewSubtask({ title: "", assignedTo: "" });
    fetchSubtasks();
  };

  const handleStatusChange = async (id, status) => {
    await axios.patch(
      `http://localhost:5000/api/subtasks/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchSubtasks();
  };

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">Subtasks</h3>

      {/* Add Subtask Form */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Subtask title"
          className="border px-3 py-2 rounded w-full"
          value={newSubtask.title}
          onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
        />
        <select
          className="border px-3 py-2 rounded w-full"
          value={newSubtask.assignedTo}
          onChange={(e) => setNewSubtask({ ...newSubtask, assignedTo: e.target.value })}
        >
          <option value="">Assign to...</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={handleAddSubtask}
        >
          Add Subtask
        </button>
      </div>

      {/* Subtask List */}
      <ul className="space-y-3">
        {subtasks.map((subtask) => (
          <li
            key={subtask._id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{subtask.title}</p>
              <p className="text-sm text-gray-500">Assigned to: {subtask.assignedToName}</p>
            </div>
            <select
              value={subtask.status}
              onChange={(e) => handleStatusChange(subtask._id, e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubtaskList;
