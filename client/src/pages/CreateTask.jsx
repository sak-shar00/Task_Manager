import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [specialization, setSpecialization] = useState("");
  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    assignedTo: "",
  });

  // ✅ Fetch all employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
    const res = await axios.get("http://localhost:5000/api/admin/users/employee");



        setEmployees(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch employees", err);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Handle field changes
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  // ✅ Handle specialization change and reset employee select
  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
    setTaskData({ ...taskData, assignedTo: "" }); // Reset selected employee
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      ...taskData,
      assignedBy: user._id,
    };

    try {
     await axios.post("http://localhost:5000/api/tasks/create", newTask);

      alert("✅ Task Created Successfully!");
      navigate("/manager");
    } catch (err) {
      console.error("❌ Task creation failed:", err);
      alert("Error creating task");
    }
  };

  // ✅ Filter employees by specialization
  const filteredEmployees = employees.filter(
  (emp) => emp.specialization === specialization
);


  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={taskData.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows="4"
          required
        />

        {/* Specialization Dropdown */}
        <div>
          <label className="block text-sm mb-1">Specialization</label>
         <select
  value={specialization}
  onChange={handleSpecializationChange}
  className="w-full border rounded px-3 py-2"
  required
>
  <option value="">-- Select Specialization --</option>
  <option value="Frontend">Frontend</option>
  <option value="Backend">Backend</option>
  <option value="Uiux">UI/UX</option>
  <option value="Designer">Designer</option>
  <option value="Devops">DevOps</option>
</select>

        </div>

        {/* Employee Dropdown */}
        <div>
          <label className="block text-sm mb-1">Assign to Employee</label>
          <select
            name="assignedTo"
            value={taskData.assignedTo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            disabled={!specialization || filteredEmployees.length === 0}
          >
            <option value="">
              {specialization
                ? filteredEmployees.length === 0
                  ? "No employee found"
                  : "-- Select Employee --"
                : "Select specialization first"}
            </option>
            {filteredEmployees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline + Priority */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm mb-1">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={taskData.deadline}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm mb-1">Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
