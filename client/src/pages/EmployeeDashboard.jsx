import { useState, useEffect } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusOptions] = useState(["Pending", "In Progress", "Completed"]);
  const [employees, setEmployees] = useState([]);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [assignedSubtasks, setAssignedSubtasks] = useState([]);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    fetchAssignedSubtasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/tasks/employee/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(res.data);
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users/employee", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.filter(emp => emp._id !== user._id));
    } catch (err) {
      setEmployees([]);
    }
  };

  const fetchAssignedSubtasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subtasks/assigned/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignedSubtasks(res.data);
    } catch (err) {
      setAssignedSubtasks([]);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    await axios.put(`http://localhost:5000/api/tasks/update-status/${taskId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
    setSelectedTask(null);
  };

  const handleSubtaskSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!subtaskTitle || !assignedTo) {
      setFormError("Please enter a title and select an employee.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/subtasks", {
        title: subtaskTitle,
        description: subtaskDescription,
        assignedTo,
        taskId: null // If you want to link to a parent task, set the ID here
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormSuccess("Task assigned successfully!");
      setSubtaskTitle("");
      setSubtaskDescription("");
      setAssignedTo("");
      setShowSubtaskForm(false);
      fetchAssignedSubtasks();
    } catch (err) {
      setFormError("Failed to assign task.");
    }
  };

  const handleSubtaskStatusChange = async (subtaskId, status) => {
    await axios.patch(`http://localhost:5000/api/subtasks/${subtaskId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAssignedSubtasks();
    setSelectedSubtask(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome {user.name}</h1>
        <button
          onClick={() => setShowSubtaskForm((prev) => !prev)}
          className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition-all text-lg font-semibold"
        >
          {showSubtaskForm ? 'Close' : 'Create Task'}
        </button>
      </div>

      {/* Create & Assign Task Form */}
      {showSubtaskForm && (
        <div className="mb-8 bg-white p-4 rounded shadow max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Assign a Task to Another Employee</h2>
          <form onSubmit={handleSubtaskSubmit}>
            <div className="mb-3">
              <label className="block font-medium mb-1">Task Title</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={subtaskTitle}
                onChange={e => setSubtaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                className="border p-2 rounded w-full"
                value={subtaskDescription}
                onChange={e => setSubtaskDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Assign To</label>
              <select
                className="border p-2 rounded w-full"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
              >
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
            {formError && <div className="text-red-500 mb-2">{formError}</div>}
            {formSuccess && <div className="text-green-600 mb-2">{formSuccess}</div>}
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Assign Task
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p className={`mt-2 text-sm font-medium text-${task.status === "Completed" ? "green" : task.status === "In Progress" ? "yellow" : "red"}-600`}>
              Status: {task.status}
            </p>
            <button
              onClick={() => setSelectedTask(task)}
              className="mt-3 px-4 py-1 bg-indigo-600 text-white rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Assigned Subtasks Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Tasks Assigned To You By Other Employees</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {assignedSubtasks.length === 0 && <p className="text-gray-500">No assigned tasks.</p>}
          {assignedSubtasks.map(subtask => (
            <div key={subtask._id} className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-semibold">{subtask.title}</h2>
              <p className="text-gray-600 mb-1">{subtask.description}</p>
              <p className="text-sm text-gray-500 mb-1">Assigned By: {subtask.assignedByName || 'N/A'}</p>
              <p className={`mt-2 text-sm font-medium text-${subtask.status === "completed" ? "green" : subtask.status === "inprogress" ? "yellow" : "red"}-600`}>
                Status: {subtask.status}
              </p>
              <button
                onClick={() => setSelectedSubtask(subtask)}
                className="mt-3 px-4 py-1 bg-indigo-600 text-white rounded"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTask && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
            <p><strong>Assigned By:</strong> {selectedTask.assignedBy?.name}</p>
            <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}</p>
            <div className="mt-4">
              <label className="font-medium">Update Status:</label>
              <select
                value={selectedTask.status}
                onChange={(e) => handleStatusChange(selectedTask._id, e.target.value)}
                className="block mt-1 border p-2 rounded"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Subtask Modal */}
      {selectedSubtask && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedSubtask.title}</h2>
            <p className="mb-2"><strong>Description:</strong> {selectedSubtask.description}</p>
            <p className="mb-2"><strong>Assigned By:</strong> {selectedSubtask.assignedByName || 'N/A'}</p>
            <div className="mt-4">
              <label className="font-medium">Update Status:</label>
              <select
                value={selectedSubtask.status}
                onChange={(e) => handleSubtaskStatusChange(selectedSubtask._id, e.target.value)}
                className="block mt-1 border p-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => setSelectedSubtask(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
