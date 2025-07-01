import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#f87171", "#facc15", "#34d399"];

const ManagerAnalytics = () => {
  const user = JSON.parse(localStorage.getItem("user")); // assuming manager is logged in
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/manager/${user._id}/analytics`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <p className="p-6">Loading analytics...</p>;

  const chartData = [
    { name: "Pending", value: data.statusCount.Pending },
    { name: "In Progress", value: data.statusCount["In Progress"] },
    { name: "Completed", value: data.statusCount.Completed },
  ];

  const leaderboardData = Object.entries(data.leaderboard).map(([name, count]) => ({
    name,
    Completed: count,
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Team Performance Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Leaderboard (Completed Tasks)</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Employee</th>
                <th className="py-2">Completed</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((emp) => (
                <tr key={emp.name}>
                  <td className="py-1">{emp.name}</td>
                  <td className="py-1 font-semibold text-green-600">{emp.Completed}</td>
                </tr>
              ))}
              {leaderboardData.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-gray-500 py-2">No completed tasks yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
