import { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const ManagerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/manager/${user._id}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [user._id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">
          Hello, {user.name}!
        </h1>
        <p className="text-gray-600 mt-1">Manage and assign tasks.</p>
      </header>

      {/* Create Task Link */}
      <section className="max-w-6xl mx-auto mb-8">
        <Link
          to="/manager/create-task"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-medium shadow hover:bg-indigo-700"
        >
          <PlusIcon size={18} /> Create New Task
        </Link>
      </section>

      {/* TASKS DISPLAY */}
      <section className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Assigned to: <strong>{task.assignedToName}</strong>
            </p>
            <p className="text-sm text-gray-500">Deadline: {task.deadline?.slice(0, 10)}</p>
            <p className="text-sm font-semibold text-red-600">Priority: {task.priority}</p>
          </div>
          

        ))}
      </section>
<div className='flex mt-5 justify-center'>     
   <Link
  to="/manager/analytics"
  className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
>
  View Analytics
</Link></div>
    </div>
  );
};

export default ManagerDashboard;
