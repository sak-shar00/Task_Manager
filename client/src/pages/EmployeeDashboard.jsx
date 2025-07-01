import { useState, useEffect } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusOptions] = useState(["Pending", "In Progress", "Completed"]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/tasks/employee/${user._id}`);
    setTasks(res.data);
  };

  const handleStatusChange = async (taskId, status) => {
    await axios.put(`http://localhost:5000/api/tasks/update-status/${taskId}`, { status });
    fetchTasks();
    setSelectedTask(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome {user.name}</h1>

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
    </div>
  );
};

export default EmployeeDashboard;
