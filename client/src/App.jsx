import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateTask from "./pages/CreateTask";
import ManagerAnalytics from "./pages/ManagerAnalytics";
import AddManager from './pages/AddManager';
import AddEmployee from'./pages/AddEmployee';
import AdminViewManagers from "./pages/AdminViewManagers";
import AdminRoute from "./components/AdminRoute";
import TaskDetails from "./pages/TaskDetails";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager/create-task"element={<CreateTask />}/>
        <Route path="/manager/analytics" element={<ManagerAnalytics />} />
        <Route path="/admin/add-manager" element={<AddManager />} />
        <Route path="/admin/add-employee" element={<AddEmployee />} />
        <Route path="/admin/view-managers" element={<AdminViewManagers />} />
        <Route element={<AdminRoute />}>
  <Route path="/register" element={<Register />} />
</Route>
<Route path="/task/:taskId" element={<TaskDetails />} />




      </Routes>
      <Footer />
    </>
  );
}


export default App;
