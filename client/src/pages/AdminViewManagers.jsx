import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const AdminViewManagers = () => {
  const [data, setData] = useState([]);
useEffect(() => {
 const fetchSummary = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const res = await axios.get("http://localhost:5000/api/admin/managers-summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setData(res.data);
  } catch (err) {
    console.error("Error fetching summary", err);
  }
};


  fetchSummary();
}, []);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Manager Summary</h1>

      {data.map((manager, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold text-indigo-600">{manager.managerName}</h2>
          <p className="text-sm text-gray-500">{manager.managerEmail}</p>

          <div className="mt-2 text-sm">
            👥 <strong>{manager.totalEmployees}</strong> Employees |
            📋 <strong>{manager.totalTasks}</strong> Tasks |
            ✅ Completed: <strong>{manager.completed}</strong> |
            🔄 In Progress: <strong>{manager.inprogress}</strong> |
            ⏳ Pending: <strong>{manager.pending}</strong>
          </div>

          <p className="mt-2 text-sm">
            ⭐ Best Performer: <span className="font-medium">{manager.bestPerformer || "N/A"}</span>
          </p>

          {/* Chart */}
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[manager]}>
                <XAxis dataKey="managerName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="inprogress" stackId="a" fill="#3b82f6" />
                <Bar dataKey="completed" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminViewManagers;
