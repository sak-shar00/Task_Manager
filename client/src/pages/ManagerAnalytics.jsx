import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ManagerAnalytics = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/manager/${user._id}`);

      const map = {};
      res.data.forEach((task) => {
        const emp = task.assignedTo?.name || "Unknown";
        if (!map[emp]) {
          map[emp] = { name: emp, completed: 0, inprogress: 0, pending: 0, total: 0 };
        }

        map[emp].total++;
        if (task.status === "completed") map[emp].completed++;
        else if (task.status === "inprogress") map[emp].inprogress++;
        else map[emp].pending++;
      });

      setGrouped(Object.values(map));
    } catch (err) {
      console.error("❌ Error fetching analytics", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Manager | Employee Task Analytics
      </h2>

      {grouped.map((emp, index) => (
        <div
          key={index}
          className="bg-white p-6 mb-10 rounded-xl shadow-md border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {emp.name} (Total Tasks: {emp.total})
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={[
                { status: "Completed", count: emp.completed },
                { status: "In Progress", count: emp.inprogress },
                { status: "Pending", count: emp.pending },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      {grouped.length === 0 && (
        <p className="text-center text-gray-500">No tasks assigned yet.</p>
      )}
    </div>
  );
};

export default ManagerAnalytics;
